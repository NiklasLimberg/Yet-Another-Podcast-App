import { FormStrategy } from "remix-auth-form";
import { Authenticator } from "remix-auth";

import { sessionStorage } from "./session.server";
import register from "~/utils/register.server"
import login from "~/utils/login.server"

interface User {
  id: string
  email: string
}

const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "user_pass_session", // keep in sync
  sessionErrorKey: "sessionErrorKey", // keep in sync
});


// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const user = await login(email, password);

    return user;
  }),
  'login-form'
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const username = form.get('username') as string;
    const user = await register(email, password, username);

    return user;
  }),
  'register-form'
);


export default authenticator;