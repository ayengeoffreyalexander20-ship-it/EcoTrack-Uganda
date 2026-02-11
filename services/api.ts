
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  limit,
  Timestamp,
  increment,
  arrayUnion
} from 'firebase/firestore';
import { User, Activity, Challenge, Recommendation, UserType, Video } from '../types';

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  public onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
          } else {
            callback(null);
          }
        } catch (err) {
          console.error("Firebase Auth profile fetch failed:", err);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // AUTH ENDPOINTS
  public async googleLogin() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    
    if (!userDocSnapshot.exists()) {
      const newUser: User = {
        id: user.uid,
        name: user.displayName || 'Eco User',
        email: user.email || '',
        type: UserType.INDIVIDUAL,
        district: 'Mbarara',
        points: 100,
        avatar: user.photoURL || user.displayName?.charAt(0) || 'U',
        joinedDate: new Date().toISOString(),
        isPremium: true
      };
      await setDoc(userDocRef, newUser);
      return { user: newUser };
    }
    return { user: userDocSnapshot.data() as User };
  }

  public async register(data: any) {
    const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const newUser: User = {
      id: result.user.uid,
      email: data.email,
      name: data.name,
      district: data.district,
      location: data.location || '',
      age: data.age || 0,
      occupation: data.occupation || '',
      type: UserType.INDIVIDUAL,
      points: 100,
      joinedDate: new Date().toISOString(),
      avatar: data.name.charAt(0),
      isPremium: true,
      language: data.language
    };
    await setDoc(doc(db, 'users', result.user.uid), newUser);
    return { user: newUser };
  }

  public async registerOrganization(data: any) {
    const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const newUser: User = {
      id: result.user.uid,
      email: data.email,
      name: data.organization_name,
      organizationName: data.organization_name,
      contactPerson: data.contact_person,
      phoneNumber: data.phone_number,
      district: data.district,
      website: data.website || '',
      organizationSize: data.organization_size || '',
      type: UserType.ORGANIZATION,
      points: 200,
      joinedDate: new Date().toISOString(),
      avatar: data.organization_name.charAt(0),
      isPremium: true,
      language: data.language
    };
    await setDoc(doc(db, 'users', result.user.uid), newUser);
    return { user: newUser };
  }

  public async login(email: string, pass: string) {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const userDocSnapshot = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDocSnapshot.exists()) throw new Error("Cloud profile not found.");
    return { user: userDocSnapshot.data() as User };
  }

  public async logout() {
    await signOut(auth);
  }

  public async updateProfile(data: any) {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, data);
  }

  public async getActivities(): Promise<Activity[]> {
    if (!auth.currentUser) return [];
    try {
      const q = query(
        collection(db, 'activities'), 
        where('userId', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
    } catch (err) {
      console.error("Activities fetch failed:", err);
      return [];
    }
  }

  public async createActivity(data: Omit<Activity, 'id' | 'timestamp'>) {
    if (!auth.currentUser) throw new Error("Please log in to track activities.");
    
    const activityData = {
      ...data,
      userId: auth.currentUser.uid,
      timestamp: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'activities'), activityData);
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, { points: increment(10) });
    
    return { id: docRef.id, ...activityData } as Activity;
  }

  public async deleteActivity(id: string) {
    await deleteDoc(doc(db, 'activities', id));
  }

  public async getVideos(): Promise<Video[]> {
    try {
      const snapshot = await getDocs(collection(db, 'videos'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
    } catch (err) {
      return [];
    }
  }

  public async uploadVideo(data: Partial<Video>) {
    if (!auth.currentUser) throw new Error("Unauthorized.");
    const docRef = await addDoc(collection(db, 'videos'), {
      ...data,
      views: 0,
      likes: 0,
      timestamp: Timestamp.now()
    });
    return { id: docRef.id, ...data } as Video;
  }

  public async getChallenges(): Promise<Challenge[]> {
    try {
      const snapshot = await getDocs(collection(db, 'challenges'));
      const userId = auth.currentUser?.uid;
      return snapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data() as any;
        const participantIds = data.participantIds || [];
        return {
          ...data,
          id: docSnapshot.id,
          isJoined: userId ? participantIds.includes(userId) : false
        } as Challenge;
      });
    } catch (err) {
      return [];
    }
  }

  public async joinChallenge(challengeId: string) {
    if (!auth.currentUser) throw new Error("Auth required to join challenges.");
    const challengeRef = doc(db, 'challenges', challengeId);
    await updateDoc(challengeRef, {
      participants: increment(1),
      participantIds: arrayUnion(auth.currentUser.uid)
    });
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, { points: increment(50) });
  }

  public async getLeaderboard(): Promise<User[]> {
    try {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnapshot => docSnapshot.data() as User);
    } catch (err) {
      return [];
    }
  }
}

export const api = ApiService.getInstance();
