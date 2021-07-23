import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { hasuraAdminClient, gql } from "../../../src/lib/hasura-admin-client";

const GetUserByEmail = gql`
  query GetUserByEmail($email: String) {
    users(where: { email: { _eq: $email } }) {
      id
      name
      email
      password
      password
    }
  }
`;

export default async (req, res) => {
  const { email, password: rawPassword } = req.body;
  ///1. find user from hasura
  const {
    users: [foundUser],
  } = await hasuraAdminClient.request(GetUserByEmail, {
    email,
  });

  //2.If user not found return error
  if (!foundUser)
    return res.status(401).json({ message: "Invalid Email/Password" });
  //3.Do the password match
  const { password, ...user } = foundUser;
  const passwordMatch = await bcrypt.compare(rawPassword, password);

  if (!passwordMatch)
    return res.status(401).json({ message: "Invalid Email/Password" });
  //4.Create JWT token
  const token = jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["guest", "user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": user.id,
      },
    },
    process.env.HASURA_GRAPHQL_JWT_SECRET,
    {
      subject: user.id,
    }
  );

  //5.Return the JWT token + user
  return res.status(201).json({ token, ...user });
};
