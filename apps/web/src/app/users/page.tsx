async function getUsers() {
  const response = await fetch('http://localhost:3003/users', { next: { revalidate: 0 } });
  return await response.json();
}

export default async function Page() {
  const users = await getUsers();

  return (
    <div>
      <h2 className="pb-4">Users</h2>
      <ul>
        {users.map((user: any) => (
          <li className="pb-2" key={user.id}>
            <p>Email: {user.email}</p>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}