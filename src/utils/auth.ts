import { User } from "../types";

const USER_ID_KEY = "@@USER_ID_KEY_FOR_MONOPOLY@@";

export function getCurrentUser(): User | null {
	const value = localStorage.getItem(USER_ID_KEY);

	if (value == null) return null;

	return JSON.parse(value);
}

export function setCurrentUser(user: User) {
	localStorage.setItem(USER_ID_KEY, JSON.stringify(user));
}

export function logout() {
	localStorage.removeItem(USER_ID_KEY);
}
