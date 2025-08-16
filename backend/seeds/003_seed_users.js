/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'admin',
          email: 'admin@unholysoulsmc.com',
          password: '$2a$12$kCIs/BVwf3DMVeLRTuMMHu98GaG9GgNoBidFF5LUiX.wTJ.Cim/p.', // 'admin123'
          role: 'admin',
          memberId: null, // Admin doesn't need to be linked to a member
          isActive: true,
          lastLogin: null
        },
        {
          username: 'don_tito',
          email: 'don.tito@unholysoulsmc.com',
          password: '$2a$12$kCIs/BVwf3DMVeLRTuMMHu98GaG9GgNoBidFF5LUiX.wTJ.Cim/p.', // 'member123'
          role: 'member',
          memberId: 1, // Link to Don Tito member
          isActive: true,
          lastLogin: null
        },
        {
          username: 'ricky_crash',
          email: 'ricky.crash@unholysoulsmc.com',
          password: '$2a$12$kCIs/BVwf3DMVeLRTuMMHu98GaG9GgNoBidFF5LUiX.wTJ.Cim/p.', // 'member123'
          role: 'member',
          memberId: 2, // Link to Ricky Lafluer member
          isActive: true,
          lastLogin: null
        }
      ]);
    });
}
