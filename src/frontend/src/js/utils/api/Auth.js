import { Api } from "./Api.js";

export class Auth {
	constructor(api) {
		if (!(api instanceof Api)) {
			throw new Error("Invalid API instance");
		}
		this.api = api;
	}

	/**
	 * @brief Get authenticated user
	 * @returns {Promise}
	 */
	async getUser() {
		// use cache if available
		if (window.user !== undefined) {
			return await {
				data: window.user,
				error: null
			}
		}
		return await this.api.request.get("user/me/");
	}

	/**
	 * @brief Login the user
	 * @param {String} identifier - The username or email
	 * @param {String} password - The password
	 */
	async loginWithIdentifier(identifier, password) {
		// if its a email
		let response = null;
		if (identifier.includes("@")) {
			response = await this.api.request.post("auth/login/", {
				email: identifier,
				password
			});
		} else {
			response = await this.api.request.post("auth/login/", {
				username: identifier,
				password
			});
		}

		if (response.data.user) {
			window.user = response.data.user;
		}
		return response;
	}

	/**
	 * @brief Login with OAuth
	 * @param {String} provider - The provider
	 */
	async loginWithOAuth(provider) {
		return await this.api.request.get(`login/${provider}/`);
	}

	/**
	 * @brief Logout the user
	 */
	async logout() {
		return await this.api.request.post("auth/logout/");
	}

	/**
	 * @brief Register a new user
	 * @param {String} username - The username
	 * @param {String} email - The email
	 * @param {String} password - The password
	 */
	async register({
		username,
		email,
		password,
		passwordConfirm
	}) {
		return await this.api.request.post("auth/register/", {
			username,
			email,
			password1: password,
			password2: passwordConfirm
		});
	}
}