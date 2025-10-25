import requests
import json

# Test backend endpoints
BASE_URL = "http://localhost:8000"

print("=" * 50)
print("Testing Backend Connection")
print("=" * 50)

# Test 1: Check if backend is running
print("\n1. Testing root endpoint...")
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"✅ Backend is running!")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Backend is NOT running!")
    print(f"Error: {e}")
    print("\nPlease start the backend first:")
    print("  cd backend")
    print("  python main.py")
    exit()

# Test 2: Check users in database
print("\n2. Checking users in database...")
try:
    response = requests.get(f"{BASE_URL}/api/users")
    users = response.json()
    print(f"✅ Found {len(users)} users:")
    for user in users:
        print(f"   - Username: {user['username']}, Name: {user['name']}, Role: {user['role']}")
except Exception as e:
    print(f"❌ Error fetching users: {e}")

# Test 3: Try login with admin credentials
print("\n3. Testing login with admin credentials...")
try:
    response = requests.post(
        f"{BASE_URL}/api/users/login",
        json={"username": "admin", "password": "admin123"}
    )
    if response.status_code == 200:
        user = response.json()
        print(f"✅ Login successful!")
        print(f"   User: {user['name']} ({user['role']})")
    else:
        print(f"❌ Login failed!")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"❌ Error during login: {e}")

# Test 4: Try login with mike credentials
print("\n4. Testing login with worker credentials...")
try:
    response = requests.post(
        f"{BASE_URL}/api/users/login",
        json={"username": "mike", "password": "mike123"}
    )
    if response.status_code == 200:
        user = response.json()
        print(f"✅ Login successful!")
        print(f"   User: {user['name']} ({user['role']})")
    else:
        print(f"❌ Login failed!")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"❌ Error during login: {e}")

# Test 5: Check issues
print("\n5. Checking issues in database...")
try:
    response = requests.get(f"{BASE_URL}/api/issues")
    issues = response.json()
    print(f"✅ Found {len(issues)} issues")
except Exception as e:
    print(f"❌ Error fetching issues: {e}")

# Test 6: Check workers
print("\n6. Checking workers in database...")
try:
    response = requests.get(f"{BASE_URL}/api/workers")
    workers = response.json()
    print(f"✅ Found {len(workers)} workers:")
    for worker in workers:
        print(f"   - {worker['name']} (ID: {worker['id']}, Assigned: {worker['assignedIssues']})")
except Exception as e:
    print(f"❌ Error fetching workers: {e}")

print("\n" + "=" * 50)
print("Test Complete!")
print("=" * 50)
print("\nIf all tests passed, your backend is working correctly.")
print("If login failed, check the backend terminal for errors.")