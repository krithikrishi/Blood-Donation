export default function MatchFeed() {
  return (
    <div className="bg-white shadow-md rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-2">🩸 Nearby Blood Requests</h2>
      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <p><strong>Patient:</strong> Priya (24)</p>
          <p><strong>Blood:</strong> B- | <strong>Distance:</strong> 3.2 km</p>
        </div>
        <hr />
        <div>
          <p><strong>Patient:</strong> Arjun (19)</p>
          <p><strong>Blood:</strong> O+ | <strong>Distance:</strong> 5.8 km</p>
        </div>
      </div>
    </div>
  );
}
