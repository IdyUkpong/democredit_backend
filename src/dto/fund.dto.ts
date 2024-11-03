import { IsInt, IsNotEmpty } from 'class-validator';

export class FundAccountDto {
    @IsInt()
    @IsNotEmpty()
    accountNumber: number;

    @IsInt()
    @IsNotEmpty()
    amount: number; // Amount to add to the existing account balance
}
