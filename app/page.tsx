import { jwtVerify } from "jose";

import { cookies } from "next/headers";
export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authjs.session-token")?.value;
  console.log(token?.split(".")); // JWT parts
  if (!token) {
    return <div>Missing token</div>;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("AUTHJS_SECRET is not set");
  }
  try {
    // Decrypt the JWE token using the derived key
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const session = await jwtVerify(token as string, secret, {
      algorithms: ["HS512"],
      typ: "JWT",
    });
    return (
      <div className="flex flex-col align-middle justify-center items-center">
        <div>APP 2</div>
        <div>{JSON.stringify(session)}</div>
      </div>
    );
  } catch (error) {
    console.error("JWT decryption error:", error);
    return <div>Invalid token</div>;
  }
}
