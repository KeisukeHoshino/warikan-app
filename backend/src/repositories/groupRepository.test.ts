import fs from "fs";
import { GroupRepository } from "./groupRepository";
import { Group } from "../type";

jest.mock("fs");

describe("GroupRepository", () => {
  const mockFs = jest.mocked(fs);
  let repo: GroupRepository;

  beforeEach(() => {
    // groupRepositoryではexistsSync、readFileSync、writeFileSyncの3つのメソッドを使用するので、テストの実行前にクリアされるようにしておく
    mockFs.existsSync.mockClear();
    mockFs.readFileSync.mockClear();
    mockFs.writeFileSync.mockClear();

    repo = new GroupRepository("groups.json");
  });

  describe("loadGroups", () => {
    it("グループ一覧が取得できる", () => {
      const groups: Group[] = [
        { name: "group1", members: ["一郎", "二郎"] },
        { name: "group2", members: ["太郎", "花子"] },
      ];
      const mockData = JSON.stringify(groups);
      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(mockData);
      const result = repo.loadGroups();
      expect(result).toEqual(groups);
    });

    it("ファイルが存在しない場合は[]が返される", () => {
      mockFs.existsSync.mockReturnValueOnce(false);
      const result = repo.loadGroups();
      expect(result).toEqual([]);
    });
  });

  describe("saveGroup", () => {
    it("グループが保存される", () => {
      const group: Group = { name: "group1", members: ["一郎", "二郎"] };
      mockFs.existsSync.mockReturnValueOnce(true);
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify([]));
      repo.saveGroup(group);
      // fsモジュールのwriteFileSync関数が正しい引数で実行されたことをテストの判定とする
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        "groups.json",
        JSON.stringify([group])
      );
    });
  });
});
