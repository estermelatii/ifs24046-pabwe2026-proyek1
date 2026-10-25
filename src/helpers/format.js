export const rupiah = (amount) => 'Rp ' + Number(amount).toLocaleString('id-ID');

export const getFirstName = (fullName) => fullName.split(' ')[0];

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
