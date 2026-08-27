import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api';

export const useGlobalStore = defineStore('global', () => {
	let user = reactive({
		token: sessionStorage.getItem('token'),
		email: null
	});

	async function getUserDetails(token) {
		if (!token) {
			sessionStorage.removeItem('token');
			user.token = null;
			user.email = null;
			return;
		}

		try {
			let { data } = await api.get('/users/details', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			sessionStorage.setItem('token', token);
			user.token = token;
			user.email = data.user ? data.user.email : data.email; 
		} catch (error) {
			console.error("Failed to fetch user details:", error);
			sessionStorage.removeItem('token');
			user.token = null;
			user.email = null;
		}
	}

	return {
		user,
		getUserDetails
	};
});