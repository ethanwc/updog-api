import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import Controller from "./interfaces/controller";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(5000, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  private connectToTheDatabase() {
    // // const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    const MONGO_USER = "superloser";
    const MONGO_PASSWORD = "m46atP6GB1SkDQlt"; //new1
    const uri =
      "mongodb+srv://fakeuser:m46atP6GB1SkDQlt@cluster0-zbnfs.mongodb.net/test123";
    const MONGO_PATH = "@cluster0-6auxr.mongodb.net";
    mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  }
}

export default App;
