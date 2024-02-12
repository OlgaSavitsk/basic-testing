import lodash from 'lodash';
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  let account: BankAccount;
  const balance = 1000;
  const amount: number = balance + 1;

  beforeAll(() => {
    jest.clearAllMocks();
    account = getBankAccount(balance);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const InsufficientError = new InsufficientFundsError(balance);
    expect(() => account.withdraw(amount)).toThrow(InsufficientError);
  });

  test('should throw error when transferring more than balance', () => {
    const transferAccount = getBankAccount(balance);
    expect(() => account.transfer(amount, transferAccount)).toThrow();
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(balance, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const result = account.getBalance() + amount;

    expect(account.deposit(amount).getBalance()).toBe(result);
  });

  test('should withdraw money', () => {
    const result = account.getBalance() - amount;

    expect(account.withdraw(amount).getBalance()).toBe(result);
  });

  test('should transfer money', () => {
    const transferAccount = getBankAccount(balance);
    const amount = account.getBalance() / 2;
    const balanceWithDraw = account.getBalance() - amount;
    const balanceDeposit = transferAccount.getBalance() + amount;

    expect(account.transfer(amount, transferAccount).getBalance()).toBe(
      balanceWithDraw,
    );

    expect(transferAccount.getBalance()).toBe(balanceDeposit);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest
      .spyOn(lodash, 'random')
      .mockImplementationOnce(() => 1)
      .mockImplementationOnce(() => 1);

    await expect(account.fetchBalance()).resolves.toBe(1);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(1);
    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(1);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(() => account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
