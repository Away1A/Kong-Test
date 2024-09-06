document.addEventListener("DOMContentLoaded", () => {
    const apiBaseUrl = "http://103.171.163.85:9000";
    let editingAnimalId = null; 

    const loginForm = document.getElementById("login-form");
    const loginResponse = document.getElementById("login-response");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;

            try {
                const response = await fetch(`http://127.0.0.1:2000/api/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    localStorage.setItem("userRole", data.role);
                    localStorage.setItem("userId", data.id);
                    loginResponse.textContent = "Login successful! Token and role stored.";
                    window.location = "dashboard.html";
                } else {
                    loginResponse.textContent = `Error: ${data.message}`;
                }
            } catch (error) {
                loginResponse.textContent = `Error: ${error.message}`;
            }
        });
    }

    const getAuthToken = () => localStorage.getItem("authToken");
    const getUserRole = () => localStorage.getItem("userRole");

    const checkAccess = (allowedRoles) => {
        const role = getUserRole();
        if (!allowedRoles.includes(role)) {
            return `Access denied. You need one of the following roles: ${allowedRoles.join(", ")}`;
        }
        return null;
    };

    async function fetchAnimals() {
        try {
            const response = await fetch(`${apiBaseUrl}/api/v1.0/animals`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching animals');
            }
            const responseData = await response.json();
            console.log('Fetched animals:', responseData); // Log the entire response
            displayAnimals(responseData.data); // Pass the `data` array to `displayAnimals`
        } catch (error) {
            console.error('Error fetching animals:', error);
        }
    }

    const animalsTableBody = document.getElementById('animals-body');
    const animalForm = document.getElementById('animal-form');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');

    function displayAnimals(animals) {
        console.log('Displaying animals:', animals); // Log the animals array
        animalsTableBody.innerHTML = '';

        animals.forEach(animal => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${animal.name}</td>
                <td>${animal.type}</td>
                <td>${animal.gender}</td>
                <td>${animal.age}</td>
                <td>${animal.price}</td>
                <td>${animal.description}</td>
                <td>${animal.status}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editAnimal('${animal.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteAnimal('${animal.id}')">Delete</button>
                </td>
            `;

            animalsTableBody.appendChild(row);
        });
    }

    animalForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const animalData = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            gender: document.getElementById('gender').value,
            age: parseInt(document.getElementById('age').value, 10),
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value,
            status: document.getElementById('status').value,
        };

        try {
            const method = editingAnimalId ? 'PUT' : 'POST';
            const url = editingAnimalId 
                ? `${apiBaseUrl}/api/v1.0/animals/${editingAnimalId}` 
                : `${apiBaseUrl}/api/v1.0/animals`;

            console.log('Submitting animal:', animalData);
            console.log('Method:', method);
            console.log('URL:', url);

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(animalData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error saving animal');
            }

            // Resetting the form after success
            editingAnimalId = null;
            formTitle.textContent = 'Add Animal';  // Reset form title
            submitButton.textContent = 'Add Animal';  // Reset submit button
            animalForm.reset();
            fetchAnimals();  // Reload the animal list
        } catch (error) {
            console.error('Error saving animal:', error);
        }
    });

    window.editAnimal = async function (id) {
        try {
            const response = await fetch(`${apiBaseUrl}/api/v1.0/animals/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching animal');
            }

            const animal = await response.json();

            // Populate form with existing animal data
            document.getElementById('name').value = animal.name;
            document.getElementById('type').value = animal.type;
            document.getElementById('gender').value = animal.gender;
            document.getElementById('age').value = animal.age;
            document.getElementById('price').value = animal.price;
            document.getElementById('description').value = animal.description;
            document.getElementById('status').value = animal.status;

            editingAnimalId = id; // Set the ID to edit
            formTitle.textContent = 'Edit Animal';
            submitButton.textContent = 'Update Animal';  // Change button to 'Update'
        } catch (error) {
            console.error('Error fetching animal:', error);
        }
    };

    window.deleteAnimal = async function (id) {
        try {
            await fetch(`${apiBaseUrl}/api/v1.0/animals/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            fetchAnimals(); // Reload animals after deletion
        } catch (error) {
            console.error('Error deleting animal:', error);
        }
    };

    fetchAnimals();
});
