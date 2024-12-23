process.env.NODE_ENV = "test";
const request = require("./util/httpRequests.js");

const getBody = (response) => response.body;

async function createNewUser() {
	const response = await request.post("/api/users", { username: "testuser" });
	return getBody(response);
}

function clearUsers() {
	return request.delete("/api/users");
}

describe(`List user`, () => {
	beforeEach(async () => {
		return await clearUsers();
	});
	it(`should respond to a GET request`, async () => {
		const response = await request.get("/api/users");
		expect(response.status).toBe(200);
	});
	it(`should respond with a JSON representation of an empty array`, async () => {
		const response = await request.get("/api/users").then(getBody);
		expect(response).toEqual([]);
	});
	it(`should respond the correct user list`, async () => {
		await createNewUser();
		const response = await request.get("/api/users").then(getBody);
		expect(response).toHaveLength(1);
		expect(response[0]).toMatchObject(
			expect.objectContaining({ username: "testuser" })
		);
	});
});

describe(`Create user`, () => {
	beforeEach(async () => {
		return await clearUsers();
	});
	it(`should respond to a POST request`, async () => {
		const response = await request.post("/api/users", {
			username: "testuser",
		});
		expect(response.status).toBe(200);
	});
	it(`should respond with the user that was posted`, async () => {
		const response = await request
			.post("/api/users", {
				username: "testuser",
			})
			.then(getBody);
		expect(response).toMatchObject(
			expect.objectContaining({ username: "testuser" })
		);
	});
});

describe(`Update user`, () => {
	beforeEach(async () => {
		return await clearUsers();
	});
	it(`should respond to a PATCH request`, async () => {
		const user = await createNewUser();
		const response = await request.patch(`/api/users/${user.uuid}`, {
			username: "new username",
		});
		expect(response.status).toBe(200);
	});
	it(`should respond with the updated user`, async () => {
		const user = await createNewUser();
		const response = await request
			.patch(`/api/users/${user.uuid}`, {
				username: "new username",
			})
			.then(getBody);
		expect(response).toMatchObject(
			expect.objectContaining({ username: "new username" })
		);
	});
});

describe(`Delete user`, () => {
	beforeEach(async () => {
		return await clearUsers();
	});
	it(`should respond to a DELETE request`, async () => {
		const user = await createNewUser();
		const response = await request.delete(`/api/users/${user.uuid}`);
		expect(response.status).toBe(200);
	});
	it(`should respond with the deleted user`, async () => {
		const user = await createNewUser();
		const response = await request
			.delete(`/api/users/${user.uuid}`)
			.then(getBody);
		expect(response).toMatchObject(
			expect.objectContaining({ username: "testuser" })
		);
	});
	it(`should delelte all users`, async () => {
		await createNewUser();
		const response = await request.delete("/api/users");
		expect(response.status).toBe(200);
	});
});
