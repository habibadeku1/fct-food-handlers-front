export default class RefGenerator {

    public static generateRef(): string {
        let string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 5)+(new Date).getTime().toString().substr(2,6);
    }
 }