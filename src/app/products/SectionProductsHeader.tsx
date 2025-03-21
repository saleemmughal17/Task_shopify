interface Collection {
  id: string;
  handle: string;
  title: string;
}

interface Props {
  collections?: Collection[]; // Optional array of collections
  onCategorySelect: (category: string | null) => void; // Function that takes a string or null
  selectedCategory: string | null; // Can be a string or null
}

const SectionProductsHeader: React.FC<Props> = ({ collections = [], onCategorySelect, selectedCategory }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* "All" button */}
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded transition ${
          !selectedCategory ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        All
      </button>

      {/* Collection buttons */}
      {collections.length > 0 ? (
        collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onCategorySelect(collection.handle)}
            className={`px-4 py-2 rounded transition ${
              selectedCategory === collection.handle ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-300"
            }`}
          >
            {collection.title || "Unnamed Collection"}
          </button>
        ))
      ) : (
        <span className="text-gray-500">No collections available</span>
      )}
    </div>
  );
};

export default SectionProductsHeader;
