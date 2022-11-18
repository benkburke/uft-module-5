import BooksPresenter from "./Books/BooksPresenter";
import booksRepository from "./Books/BooksRepository";
import httpGateway from "./Shared/HttpGateway";
import Observable from "./Shared/Observable";

let viewModel;
let booksPresenter;
let booksStub;
let allBooksStub;

beforeEach(async () => {
  viewModel = null;
  booksPresenter = new BooksPresenter();
  booksRepository.programmersModel = new Observable([]);

  booksStub = {
    success: true,
    result: [
      {
        bookId: 21601,
        name: "Wind in the willows",
        ownerId: "bburke@greencheckverified.com",
        author: "Kenneth Graeme",
      },
      {
        bookId: 21611,
        name: "I, Robot",
        ownerId: "bburke@greencheckverified.com",
        author: "Isaac Asimov",
      },
      {
        bookId: 21621,
        name: "The Hobbit",
        ownerId: "bburke@greencheckverified.com",
        author: "Jrr Tolkein",
      },
    ],
  };

  allBooksStub = {
    success: true,
    result: [
      {
        bookId: 31,
        name: "Moby Dick",
        ownerId: null,
        author: "Herman Melville",
      },
      {
        bookId: 41,
        name: "The Art of War",
        ownerId: null,
        author: "Sun Tzu",
      },
      {
        bookId: 21601,
        name: "Wind in the willows",
        ownerId: "bburke@greencheckverified.com",
        author: "Kenneth Graeme",
      },
      {
        bookId: 21611,
        name: "I, Robot",
        ownerId: "bburke@greencheckverified.com",
        author: "Isaac Asimov",
      },
      {
        bookId: 21621,
        name: "The Hobbit",
        ownerId: "bburke@greencheckverified.com",
        author: "Jrr Tolkein",
      },
    ],
  };

  httpGateway.get = jest.fn().mockImplementation((path) => {
    if (
      path ===
      "https://api.logicroom.co/api/bburke@greencheckverified.com/allbooks"
    ) {
      return allBooksStub;
    } else if (
      path ===
      "https://api.logicroom.co/api/bburke@greencheckverified.com/books"
    ) {
      return booksStub;
    }
  });
});

let setup = async (userMode) => {
  booksPresenter.setMode(userMode);
  await booksPresenter.load((generatedViewModel) => {
    viewModel = generatedViewModel;
  });
};

describe("load books usecase", () => {
  it("should load private books by default", async () => {
    await setup("");

    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/bburke@greencheckverified.com/books"
    );
    expect(viewModel.length).toBe(3);
    expect(viewModel[0].name).toBe("Wind in the willows");
    expect(viewModel[1].name).toBe("I, Robot");
    expect(viewModel[2].name).toBe("The Hobbit");
  });

  it("should load private books", async () => {
    await setup("private");

    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/bburke@greencheckverified.com/books"
    );
    expect(viewModel.length).toBe(3);
    expect(viewModel[0].name).toBe("Wind in the willows");
    expect(viewModel[1].name).toBe("I, Robot");
    expect(viewModel[2].name).toBe("The Hobbit");
  });

  it("should load public books", async () => {
    await setup("public");

    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/bburke@greencheckverified.com/allbooks"
    );
    expect(viewModel.length).toBe(5);
    expect(viewModel[0].name).toBe("Moby Dick");
    expect(viewModel[1].name).toBe("The Art of War");
    expect(viewModel[2].name).toBe("Wind in the willows");
    expect(viewModel[3].name).toBe("I, Robot");
    expect(viewModel[4].name).toBe("The Hobbit");
  });
});

describe("sort books usecase", () => {
  it("should sort ascending on name when user chooses to", async () => {
    await setup("private");

    await booksPresenter.sortBooks("asc");

    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/bburke@greencheckverified.com/books"
    );
    expect(viewModel.length).toBe(3);
    expect(viewModel[0].name).toBe("I, Robot");
    expect(viewModel[1].name).toBe("The Hobbit");
    expect(viewModel[2].name).toBe("Wind in the willows");
  });

  it("should sort descending on name when user chooses to", async () => {
    await setup("private");

    await booksPresenter.sortBooks("desc");

    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/bburke@greencheckverified.com/books"
    );
    expect(viewModel.length).toBe(3);
    expect(viewModel[0].name).toBe("Wind in the willows");
    expect(viewModel[1].name).toBe("The Hobbit");
    expect(viewModel[2].name).toBe("I, Robot");
  });
});
