document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://172.17.144.1:9000"; // Ganti dengan URL Kong API Anda

    // Login
    const loginForm = document.getElementById("login-form");
    const loginResponse = document.getElementById("login-response");
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const response = await fetch(`${apiBaseUrl}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.token) {
                // Simpan token dan role ke localStorage
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userRole", data.role); // Simpan role
                loginResponse.textContent = "Login successful! Token and role stored.";
            } else {
                loginResponse.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            loginResponse.textContent = `Error: ${error.message}`;
        }
    });

    // Helper function to get token and role from storage
    const getAuthToken = () => localStorage.getItem("authToken");
    const getUserRole = () => localStorage.getItem("userRole");

    // Check user role and access service
    const checkAccess = (allowedRoles) => {
        const role = getUserRole();
        if (!allowedRoles.includes(role)) {
            return `Access denied. You need one of the following roles: ${allowedRoles.join(", ")}`;
        }
        return null;
    };

    // Get All Objects
    const getObjectsButton = document.getElementById("get-objects");
    const objectsResponse = document.getElementById("objects-response");
    getObjectsButton.addEventListener("click", async () => {
        const accessError = checkAccess(['user']);
        if (accessError) {
            objectsResponse.textContent = accessError;
            return;
        }
        try {
            const jwtToken = getAuthToken();
            const response = await fetch(`${apiBaseUrl}/objects`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            });
            const data = await response.json();
            objectsResponse.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            objectsResponse.textContent = `Error: ${error.message}`;
        }
    });

    // Add Object
    const addObjectForm = document.getElementById("add-object-form");
    const addObjectResponse = document.getElementById("add-object-response");
    addObjectForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const objectName = e.target["object-name"].value;

        const accessError = checkAccess(['admin']);
        if (accessError) {
            addObjectResponse.textContent = accessError;
            return;
        }
        try {
            const jwtToken = getAuthToken();
            const response = await fetch(`${apiBaseUrl}/objects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ name: objectName }),
            });
            const data = await response.json();
            addObjectResponse.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            addObjectResponse.textContent = `Error: ${error.message}`;
        }
    });

    // Get Countries
    const getCountriesButton = document.getElementById("get-countries");
    const countriesResponse = document.getElementById("countries-response");
    getCountriesButton.addEventListener("click", async () => {
        const accessError = checkAccess(['admin', 'user']);
        if (accessError) {
            countriesResponse.textContent = accessError;
            return;
        }
        try {
            const jwtToken = getAuthToken();
            const response = await fetch(`${apiBaseUrl}/api/countries`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            });
            const data = await response.json();
            countriesResponse.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            countriesResponse.textContent = `Error: ${error.message}`;
        }
    });

    // Get Users
    const getUsersButton = document.getElementById("get-users");
    const usersResponse = document.getElementById("users-response");
    getUsersButton.addEventListener("click", async () => {
        const accessError = checkAccess(['admin']);
        if (accessError) {
            usersResponse.textContent = accessError;
            return;
        }
        try {
            const jwtToken = getAuthToken();
            const response = await fetch(`${apiBaseUrl}/api/users`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            });
            const data = await response.json();
            usersResponse.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            usersResponse.textContent = `Error: ${error.message}`;
        }
    });

    // Get Products
    const getProductsButton = document.getElementById("get-products");
    const productsResponse = document.getElementById("products-response");
    getProductsButton.addEventListener("click", async () => {
        const accessError = checkAccess(['user']);
        if (accessError) {
            productsResponse.textContent = accessError;
            return;
        }
        try {
            const jwtToken = getAuthToken();
            const response = await fetch(`${apiBaseUrl}/api/products`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            });
            const data = await response.json();
            productsResponse.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            productsResponse.textContent = `Error: ${error.message}`;
        }
    });
});
