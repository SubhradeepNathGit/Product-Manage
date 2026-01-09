async function test() {
    console.log("Testing Registration...");
    try {
        const res = await fetch('http://localhost:3006/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: "test" + Date.now() + "@test.com",
                password: "password123"
            })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}
test();
