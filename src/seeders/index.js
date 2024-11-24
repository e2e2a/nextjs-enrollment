'use server';
const createAdminUsers = require('./admin.js');
const createRooms = require('./room.js');
const createSubjects = require('./subject.js'); 
const createTeacherUsers = require('./teacher.js');

(async () => {
  try {
    await createRooms(); 
    await createSubjects();
    await createAdminUsers(); 
    await createTeacherUsers();
    
    console.log('Seeding complete!');
  } catch (err) {
    console.error('Error during seeding:', err);
  }
})();
