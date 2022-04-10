import type { LoaderFunction, ActionFunction} from "remix";
import { Form, useLoaderData } from "remix";
import authenticator from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request);
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix Protected Dashboard</h1>
      <p>{data?.email}   {data?.token}</p>
      <Form method="post">
        <button>Log Out</button>
      </Form>
    </div>
  );
}
