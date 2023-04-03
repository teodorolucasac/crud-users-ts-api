import { ObjectId } from "mongodb";

import { IUpdateUserRepository } from "../../controllers/update-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";

export class MongUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(id: string, params: any): Promise<User> {
    await MongoClient.db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );

    const user = await MongoClient.db
      .collection<Omit<User, "id">>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new Error("User not updated");
    }

    const { _id, ...rest } = user

    return { id: _id.toHexString(), ...rest};
  }
}
