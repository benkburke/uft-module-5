import httpGateway from "../Shared/HttpGateway";
import Observable from "../Shared/Observable";

class BooksRepository {
  programmersModel = null;
  callback = null;
  mode = "books";

  constructor() {
    this.programmersModel = new Observable([]);
  }

  getBooks = async (callback) => {
    this.programmersModel.subscribe(callback);
    if (this.programmersModel.value.length === 0) {
      await this.loadApiData();
    } else {
      this.refreshModelData();
    }
  };

  loadApiData = async () => {
    const dto = await httpGateway.get(
      "https://api.logicroom.co/api/bburke@greencheckverified.com/" + this.mode
    );
    this.programmersModel.value = dto.result.map((dtoItem) => {
      return dtoItem;
    });
    this.programmersModel.notify();
  };

  refreshModelData = () => {
    this.programmersModel.value = this.programmersModel.value.map((pm) => {
      return pm;
    });
    this.programmersModel.notify();
  };

  sortBooks = async (direction) => {
    if (direction === "asc") {
      this.programmersModel.value = this.programmersModel.value.sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
    } else if (direction === "desc") {
      this.programmersModel.value = this.programmersModel.value.sort((a, b) =>
        a.name < b.name ? 1 : -1
      );
    }

    this.programmersModel.notify();
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
