export default function Header() {

  return (

    <header className="bg-blue-800 text-white flex justify-between items-center px-6 py-3 shadow">

      <div className="flex items-center gap-3">

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Government_Seal_of_Bangladesh.svg/1024px-Government_Seal_of_Bangladesh.svg.png"
          className="w-8"
        />

        <h1 className="font-semibold">
          ShebaConnect Government Service Portal
        </h1>

      </div>

      <div className="flex items-center gap-4">

        <span className="text-sm">Welcome, User</span>

        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full"
        />

      </div>

    </header>

  );

}