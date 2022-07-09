import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { DB } from ".";
import { User } from "../types";

const userCollection = collection(DB, "users");

export function createUser(username: string, password: string) {
	const docRef = doc(userCollection);

	const user: User = {
		username,
		password,
		createdAt: new Date(),
		userId: docRef.id,
	};
	return setDoc(docRef, user);
}

export async function findUser(username: string, password: string) {
	const q = query(userCollection, where("username", "==", username), where("password", "==", password));

	const doc = await getDocs(q);

	return doc?.docs?.[0]?.data() as User;
}
