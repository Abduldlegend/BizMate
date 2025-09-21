// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Button from "@/components/ui/button"
// import Input from "@/components/ui/input"
// import axios from "axios";

// export default function InventoryPage() {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState("");

//   // Fetch products
  // const fetchProducts = async () => {
  //   // const res = await axios.get(`/api/inventory/products?search=${search}`);
  //   // setProducts(res.data);
  //   axios.get("http://localhost:5000/api/inventory/products")
  //   .then(res => {
  //     console.log("API Response:", res.data);  // 👀 check what backend actually returns
  //     setProducts(res.data);
  //   })
  //   .catch(err => console.error(err));

  // };

//   useEffect(() => {
//     fetchProducts();
//   }, [search]);

//   return (
//     <div className="flex min-h-screen">
//       <Sidebar />
//       <main className="flex-1 p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">Inventory Management</h1>
//           <Button className="bg-googleGreen text-white">➕ Add Product</Button>
//         </div>

//         {/* Search Bar */}
//         <div className="mb-4">
//           <Input
//             placeholder="Search by name or SKU..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full sm:w-1/2"
//           />
//         </div>

//         {/* Product Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white rounded-2xl shadow min-w-[800px]">
//             <thead className="bg-googleBlue text-white">
//               <tr>
//                 <th className="p-2 text-left">Item</th>
//                 <th className="p-2 text-left">SKU</th>
//                 <th className="p-2 text-left">Category</th>
//                 <th className="p-2 text-left">Stock</th>
//                 <th className="p-2 text-left">Cost</th>
//                 <th className="p-2 text-left">Selling</th>
//                 <th className="p-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((p) => (
//                 <tr key={p._id} className="border-b">
//                   <td className="p-2">{p.name}</td>
//                   <td className="p-2">{p.sku}</td>
//                   <td className="p-2">{p.category}</td>
//                   <td className="p-2">{p.quantity}</td>
//                   <td className="p-2">₦{p.costPrice}</td>
//                   <td className="p-2">₦{p.sellingPrice}</td>
//                   <td className="p-2">
//                     <Button size="sm" className="bg-yellow-500 mr-2">Edit</Button>
//                     <Button size="sm" className="bg-red-500">Delete</Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import axios from "axios";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // New product state
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
  });

  // Fetch products
  // const fetchProducts = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/inventory/products", {
  //       params: { search },
  //     });
  //     console.log("Fetched:", res.data);
  //     setProducts(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/inventory/products", {
      params: { search },
    });

    // Defensive check
    if (Array.isArray(res.data)) {
      setProducts(res.data);
    } else if (Array.isArray(res.data.products)) {
      setProducts(res.data.products);
    } else {
      setProducts([]); // fallback
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    setProducts([]);
  }
};

  

  useEffect(() => {
    fetchProducts();
  }, [search]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle form submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/inventory/products", newProduct);
      setShowModal(false);
      setNewProduct({ name: "", sku: "", category: "", quantity: 0, costPrice: 0, sellingPrice: 0 });
      fetchProducts(); // Refresh table
    } catch (err) {
      console.error(err);
      alert("Error adding product: " + err.response?.data?.error);
    }
  };

  // DELETE product
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/inventory/products/${id}`);
    setProducts(products.filter((p) => p._id !== id)); // remove from UI
  } catch (err) {
    console.error(err);
    alert("Error deleting product");
  }
};

// EDIT product (open modal with data)
const [editingProduct, setEditingProduct] = useState(null);

const handleEdit = (product) => {
  setEditingProduct(product); // open modal with pre-filled data
};


  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">Inventory Management</h1>
            <Button
                className="bg-googleGreen text-white w-full sm:w-auto"
                onClick={() => setShowModal(true)}
            >
                ➕ Add Product
            </Button>
        </div>

        <div className="mb-4">
  <Input
    placeholder="Search by name or SKU..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:w-1/2"
  />
</div>


        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow min-w-[800px]">
            <thead className="bg-googleBlue text-white">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Cost</th>
                <th className="p-2 text-left">Selling</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.sku}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">{p.quantity}</td>
                  <td className="p-2">₦{p.costPrice}</td>
                  <td className="p-2">₦{p.sellingPrice}</td>
                  <td className="p-2">
                    <Button
  size="sm"
  className="bg-yellow-500 mr-2"
  onClick={() => handleEdit(p)}
>
  Edit
</Button>

<Button
  size="sm"
  className="bg-red-500"
  onClick={() => handleDelete(p._id)}
>
  Delete
</Button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Edit Product</h2>
      <Input
        placeholder="Item name"
        value={editingProduct.name}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, name: e.target.value })
        }
        className="mb-2"
      />
      <Input
        placeholder="SKU"
        value={editingProduct.sku}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, sku: e.target.value })
        }
        className="mb-2"
      />
      <Input
        placeholder="Category"
        value={editingProduct.category}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, category: e.target.value })
        }
        className="mb-2"
      />
      <Input
        placeholder="Quantity"
        type="number"
        value={editingProduct.quantity}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            quantity: Number(e.target.value),
          })
        }
        className="mb-2"
      />
      <Input
        placeholder="Cost Price"
        type="number"
        value={editingProduct.costPrice}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            costPrice: Number(e.target.value),
          })
        }
        className="mb-2"
      />
      <Input
        placeholder="Selling Price"
        type="number"
        value={editingProduct.sellingPrice}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            sellingPrice: Number(e.target.value),
          })
        }
        className="mb-4"
      />

      <div className="flex justify-end gap-2">
        <Button
          className="bg-gray-400"
          onClick={() => setEditingProduct(null)}
        >
          Cancel
        </Button>
        <Button
          className="bg-googleGreen text-white"
          onClick={async () => {
            try {
              const res = await axios.put(
                `http://localhost:5000/api/inventory/products/${editingProduct._id}`,
                editingProduct
              );
              setProducts(
                products.map((p) =>
                  p._id === editingProduct._id ? res.data : p
                )
              );
              setEditingProduct(null);
            } catch (err) {
              console.error(err);
              alert("Error updating product");
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}

        </div>

        {/* Add Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <Input name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} required />
                <Input name="sku" placeholder="SKU" value={newProduct.sku} onChange={handleChange} required />
                <Input name="category" placeholder="Category" value={newProduct.category} onChange={handleChange} />
                <Input type="number" name="quantity" placeholder="Quantity" value={newProduct.quantity} onChange={handleChange} required />
                <Input type="number" name="costPrice" placeholder="Cost Price" value={newProduct.costPrice} onChange={handleChange} required />
                <Input type="number" name="sellingPrice" placeholder="Selling Price" value={newProduct.sellingPrice} onChange={handleChange} required />
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button type="button" className="bg-gray-400 text-white" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-googleGreen text-white">Save</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
