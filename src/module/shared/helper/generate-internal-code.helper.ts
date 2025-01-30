export function generateInternalCode(initials: string): string {
  const generateRandomString = (length: number): string => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  const randomString = generateRandomString(10);
  return (initials + randomString).toUpperCase();
}
