export default interface Transaction{
    _id: string;
    crypto_code: string;
    crypto_amount: number,
    money: number,
    user_id: string,
    action: string,
    datetime: string;
}