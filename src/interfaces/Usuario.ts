export default interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    heroes: string[];
    credits: number;
}