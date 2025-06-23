export function waitUntilElementExists(id, timeout = 2000, interval = 100) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
  
      const check = () => {
        const el = document.getElementById(id);
        if (el) return resolve(el);
  
        if (Date.now() - startTime >= timeout) {
          return reject();
        }
  
        setTimeout(check, interval);
      };
  
      check();
    });
}
  
  