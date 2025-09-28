import { ExpenseService } from "./expenseService";
import { GroupService } from "./groupService";
import { ExpenseRepository } from "../repositories/expenseRepository";
import { Expense, Group } from "../type";

describe("ExpenseService", () => {
  // partialはジェネリクスで渡した型のすべてのプロパティをオプショナルにするユーティリティ型
  // partialを使うことで、依存するクラスのすべてをモック化するのではなく、一部のメソッドのみをモック化して利用できるようになる。
  let mockGroupService: Partial<GroupService>;
  let mockExpenseRepository: Partial<ExpenseRepository>;
  let expenseService: ExpenseService;

  const group: Group = { name: "group1", members: ["一郎", "二郎"] };
  const expense: Expense = {
    groupName: "group1",
    expenseName: "ランチ",
    amount: 2000,
    payer: "一郎",
  };

  beforeEach(() => {
    mockGroupService = {
      getGroupByName: jest.fn(),
    };
    mockExpenseRepository = {
      loadExpenses: jest.fn(),
      saveExpense: jest.fn(),
    };
    expenseService = new ExpenseService(
      mockExpenseRepository as ExpenseRepository,
      mockGroupService as GroupService
    );
  });

  describe("addExpense", () => {
    it("支出が登録される", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepository.saveExpense).toHaveBeenCalledWith(expense);
    });
  });

  it("グループが存在しない場合はエラーが発生する", () => {
    (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(null);
    expect(() => {
      expenseService.addExpense(expense);
    }).toThrow();
  });

  it("支払い者が存在しない場合はエラーが発生する", () => {
    (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);
    const nonMemberExpense: Expense = { ...expense, payer: "太郎" };
    expect(() => {
      expenseService.addExpense(nonMemberExpense);
    }).toThrow();
  });

  it("決済リストが取得できる", () => {
    (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);
    (mockExpenseRepository.loadExpenses as jest.Mock).mockReturnValueOnce([
      expense,
    ]);
    const amount = [{ amount: 1000, from: "二郎", to: "一郎" }];
    expect(expenseService.getSettlements(group.name)).toStrictEqual(amount);
  });
});
