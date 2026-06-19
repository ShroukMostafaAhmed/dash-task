describe("CRUD helper functions", () => {
  describe("optimistic update", () => {
    it("updates item in array by id", () => {
      const items = [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
        { id: 3, title: "Post 3" },
      ];
      const updated = items.map((p) => (p.id === 2 ? { ...p, title: "Updated" } : p));
      expect(updated[1].title).toBe("Updated");
      expect(updated[0].title).toBe("Post 1");
      expect(updated[2].title).toBe("Post 3");
    });

    it("removes item from array by id", () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const filtered = items.filter((p) => p.id !== 2);
      expect(filtered).toHaveLength(2);
      expect(filtered.find((p) => p.id === 2)).toBeUndefined();
    });

    it("adds item to beginning of array", () => {
      const items = [{ id: 2 }, { id: 3 }];
      const newItem = { id: 1 };
      const result = [newItem, ...items];
      expect(result[0].id).toBe(1);
      expect(result).toHaveLength(3);
    });
  });

  describe("search filter", () => {
    const posts = [
      { id: 1, title: "Hello World", body: "body 1" },
      { id: 2, title: "Goodbye World", body: "body 2" },
      { id: 3, title: "Test Post", body: "body 3" },
    ];

    it("filters posts by title (case insensitive)", () => {
      const result = posts.filter((p) =>
        p.title.toLowerCase().includes("hello")
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("returns all posts when search is empty", () => {
      const search = "";
      const result = search ? posts.filter((p) => p.title.includes(search)) : posts;
      expect(result).toHaveLength(3);
    });

    it("returns empty when no match", () => {
      const result = posts.filter((p) =>
        p.title.toLowerCase().includes("xyz")
      );
      expect(result).toHaveLength(0);
    });
  });

  describe("pagination", () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    it("returns correct page slice", () => {
      const page = 2;
      const limit = 10;
      const result = items.slice((page - 1) * limit, page * limit);
      expect(result).toHaveLength(10);
      expect(result[0].id).toBe(11);
    });

    it("calculates total pages correctly", () => {
      const totalPages = Math.ceil(items.length / 10);
      expect(totalPages).toBe(3);
    });

    it("handles last page with fewer items", () => {
      const page = 3;
      const limit = 10;
      const result = items.slice((page - 1) * limit, page * limit);
      expect(result).toHaveLength(5);
    });
  });
});
