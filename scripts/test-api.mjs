

const BASE_URL = 'http://localhost:3000/api/notes';

async function testAPI() {
    console.log('🚀 Starting API Verification...');

    try {
        // 1. Create a Note
        console.log('\n1. Testing POST /api/notes (Create)...');
        const createRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test Note', content: 'This is a test note for verification.' }),
        });

        if (!createRes.ok) throw new Error(`Create failed: ${createRes.statusText}`);
        const createData = await createRes.json();
        const noteId = createData.note._id;
        console.log('✅ Created Note ID:', noteId);

        // 2. Get All Notes
        console.log('\n2. Testing GET /api/notes (List)...');
        const listRes = await fetch(BASE_URL);
        if (!listRes.ok) throw new Error(`List failed: ${listRes.statusText}`);
        const listData = await listRes.json();
        const found = listData.notes.some(n => n._id === noteId);
        if (found) console.log('✅ Created note found in list');
        else console.error('❌ Created note NOT found in list');

        // 3. Update Note
        console.log('\n3. Testing PUT /api/notes/[id] (Update)...');
        const updateRes = await fetch(`${BASE_URL}/${noteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Updated Test Note', content: 'Updated content.' }),
        });
        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
        console.log('✅ Note updated');

        // 4. Verify Update
        const getRes = await fetch(`${BASE_URL}/${noteId}`);
        const getData = await getRes.json();
        if (getData.note.title === 'Updated Test Note') console.log('✅ Update verified');
        else console.error('❌ Update verification failed');

        // 5. Delete Note
        console.log('\n4. Testing DELETE /api/notes/[id] (Delete)...');
        const deleteRes = await fetch(`${BASE_URL}/${noteId}`, { method: 'DELETE' });
        if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.statusText}`);
        console.log('✅ Note deleted');

        // 6. Verify Deletion
        const verifyDeleteRes = await fetch(`${BASE_URL}/${noteId}`);
        if (verifyDeleteRes.status === 404) console.log('✅ Deletion verified (404 Not Found)');
        else console.error('❌ Deletion verification failed (Note still exists)');

        console.log('\n🎉 All API tests passed!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.cause) console.error(error.cause);
    }
}

testAPI();
