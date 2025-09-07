import fs from "fs";
import { ExpenseRepository } from "./expenseRepository";
import { Expense } from "../type";

jest.mock("fs");
const mockFs = jest.mocked(fs);
let repo: ExpenseRepository;

beforeEach(() => {
  mockFs.writeFileSync.mockClear();
  mockFs.existsSync.mockClear();
  mockFs.readFileSync.mockClear();
  repo = new ExpenseRepository("expenses.json");
});

describe("loadExpenses", () => {
  it("should load expenses from file", () => {
    const groups: Expense[] = [
      {
        groupName: "グループ１",
        expenseName: "食費",
        payer: "星野",
        amount: 1000,
      },
      {
        groupName: "グループ2",
        expenseName: "食費",
        payer: "星野",
        amount: 2000,
      },
    ];
    const mockData = JSON.stringify(groups);
    mockFs.existsSync.mockReturnValueOnce(true);
    mockFs.readFileSync.mockReturnValueOnce(mockData);
    const result = repo.loadExpenses();
    expect(result).toEqual(groups);
  });

  it("should save expenses from file", () => {
    const groups: Expense = {
      groupName: "グループ１",
      expenseName: "食費",
      payer: "星野",
      amount: 1000,
    };

    mockFs.existsSync.mockReturnValueOnce(true);
    mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
    repo.saveExpense(groups);
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      "expenses.json",
      JSON.stringify([groups])
    );
  });
});
