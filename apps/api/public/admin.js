let token = localStorage.getItem('adminToken');
let currentTab = 'services';

// Check if user is logged in
if (token) {
    showAdmin();
} else {
    showLogin();
}

// Login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('adminToken', token);
            showAdmin();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
});

function showLogin() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminSection').classList.add('hidden');
}

function showAdmin() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('adminSection').classList.remove('hidden');
    loadServices();
    loadNavigation();
    loadSettings();
}

function logout() {
    localStorage.removeItem('adminToken');
    token = null;
    showLogin();
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
    event.target.classList.add('active');
    currentTab = tabName;
}

// Services Management
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = '';
        
        data.data.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <div>
                    <strong>${service.heroTitle}</strong>
                    <br><small>${service.id}</small>
                </div>
                <div>
                    <button onclick="editService('${service.id}')">Edit</button>
                    <button onclick="deleteService('${service.id}')" style="background: #dc3545; margin-left: 0.5rem;">Delete</button>
                </div>
            `;
            servicesList.appendChild(serviceItem);
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function showServiceForm(serviceId = null) {
    document.getElementById('serviceForm').classList.remove('hidden');
    document.getElementById('serviceFormTitle').textContent = serviceId ? 'Edit Service' : 'Add Service';
    
    if (serviceId) {
        loadServiceData(serviceId);
    } else {
        document.getElementById('serviceFormElement').reset();
    }
}

function hideServiceForm() {
    document.getElementById('serviceForm').classList.add('hidden');
}

async function loadServiceData(serviceId) {
    try {
        const response = await fetch(`/api/services/${serviceId}`);
        const data = await response.json();
        const service = data.data[0];
        
        document.getElementById('serviceId').value = service.id;
        document.getElementById('heroTitle').value = service.heroTitle;
        document.getElementById('heroTagline').value = service.heroTagline;
        document.getElementById('heroImage').value = service.heroImage;
        document.getElementById('featuredImage').value = service.featuredImage;
        document.getElementById('description').value = service.description.join('\n');
        document.getElementById('highlights').value = service.highlights.join('\n');
        document.getElementById('images').value = service.images.join('\n');
        document.getElementById('ctaText').value = service.cta.text;
        document.getElementById('ctaButtonLabel').value = service.cta.buttonLabel;
    } catch (error) {
        console.error('Error loading service:', error);
    }
}

function editService(serviceId) {
    showServiceForm(serviceId);
}

async function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
        const response = await fetch(`/api/services/${serviceId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            loadServices();
        } else {
            alert('Error deleting service');
        }
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}

document.getElementById('serviceFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const serviceData = {
        id: document.getElementById('serviceId').value,
        heroTitle: document.getElementById('heroTitle').value,
        heroTagline: document.getElementById('heroTagline').value,
        heroImage: document.getElementById('heroImage').value,
        featuredImage: document.getElementById('featuredImage').value,
        description: document.getElementById('description').value.split('\n').filter(line => line.trim()),
        highlights: document.getElementById('highlights').value.split('\n').filter(line => line.trim()),
        images: document.getElementById('images').value.split('\n').filter(line => line.trim()),
        cta: {
            text: document.getElementById('ctaText').value,
            buttonLabel: document.getElementById('ctaButtonLabel').value
        }
    };
    
    try {
        const response = await fetch('/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(serviceData)
        });
        
        if (response.ok) {
            hideServiceForm();
            loadServices();
        } else {
            alert('Error saving service');
        }
    } catch (error) {
        console.error('Error saving service:', error);
    }
});

// Navigation Management
async function loadNavigation() {
    try {
        const response = await fetch('/api/nav-links');
        const data = await response.json();
        const navData = data.data;
        
        // Load left links
        const leftLinksContainer = document.getElementById('leftLinks');
        leftLinksContainer.innerHTML = '';
        navData.leftLinks.forEach((link, index) => {
            addNavLinkField('left', link, index);
        });
        
        // Load right links
        const rightLinksContainer = document.getElementById('rightLinks');
        rightLinksContainer.innerHTML = '';
        navData.rightLinks.forEach((link, index) => {
            addNavLinkField('right', link, index);
        });
        
        // Load CTA buttons
        document.getElementById('primaryLabel').value = navData.ctaButtons.primary?.label || '';
        document.getElementById('primaryUrl').value = navData.ctaButtons.primary?.url || '';
        document.getElementById('secondaryLabel').value = navData.ctaButtons.secondary?.label || '';
        document.getElementById('secondaryUrl').value = navData.ctaButtons.secondary?.url || '';
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

function addNavLink(side) {
    addNavLinkField(side, { label: '', url: '', openInNewTab: false });
}

function addNavLinkField(side, link = { label: '', url: '', openInNewTab: false }, index = null) {
    const container = document.getElementById(side + 'Links');
    const linkDiv = document.createElement('div');
    linkDiv.className = 'form-group';
    linkDiv.innerHTML = `
        <input type="text" placeholder="Label" value="${link.label}" data-field="label">
        <input type="text" placeholder="URL" value="${link.url}" data-field="url">
        <label><input type="checkbox" ${link.openInNewTab ? 'checked' : ''} data-field="openInNewTab"> Open in new tab</label>
        <button type="button" onclick="this.parentElement.remove()" style="background: #dc3545;">Remove</button>
    `;
    container.appendChild(linkDiv);
}

document.getElementById('navigationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const leftLinks = Array.from(document.getElementById('leftLinks').children).map(div => ({
        label: div.querySelector('[data-field="label"]').value,
        url: div.querySelector('[data-field="url"]').value,
        openInNewTab: div.querySelector('[data-field="openInNewTab"]').checked
    }));
    
    const rightLinks = Array.from(document.getElementById('rightLinks').children).map(div => ({
        label: div.querySelector('[data-field="label"]').value,
        url: div.querySelector('[data-field="url"]').value,
        openInNewTab: div.querySelector('[data-field="openInNewTab"]').checked
    }));
    
    const navData = {
        leftLinks,
        rightLinks,
        ctaButtons: {
            primary: {
                label: document.getElementById('primaryLabel').value,
                url: document.getElementById('primaryUrl').value,
                variant: 'primary'
            },
            secondary: {
                label: document.getElementById('secondaryLabel').value,
                url: document.getElementById('secondaryUrl').value,
                variant: 'secondary'
            }
        }
    };
    
    try {
        const response = await fetch('/api/nav-links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(navData)
        });
        
        if (response.ok) {
            alert('Navigation updated successfully');
        } else {
            alert('Error updating navigation');
        }
    } catch (error) {
        console.error('Error updating navigation:', error);
    }
});

// Settings Management
async function loadSettings() {
    try {
        const response = await fetch('/api/global-settings');
        const data = await response.json();
        const settings = data.data;
        
        document.getElementById('siteTitle').value = settings.siteTitle || '';
        document.getElementById('contactEmail').value = settings.contactEmail || '';
        document.getElementById('phoneNumber').value = settings.phoneNumber || '';
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const settings = [
        { key: 'siteTitle', value: document.getElementById('siteTitle').value },
        { key: 'contactEmail', value: document.getElementById('contactEmail').value },
        { key: 'phoneNumber', value: document.getElementById('phoneNumber').value }
    ];
    
    try {
        for (const setting of settings) {
            await fetch('/api/global-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(setting)
            });
        }
        alert('Settings updated successfully');
    } catch (error) {
        console.error('Error updating settings:', error);
    }
});