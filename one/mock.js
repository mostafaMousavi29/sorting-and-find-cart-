const cpuOptions = ["i3", "i5", "i7", "i9"];
const ramOptions = [4, 8, 16, 32];
const storageOptions = [128, 256, 512, 1024];
const storageType = ["SSD", "HDD"];

const data = [];

for (let i = 1; i <= 100; i++) {
  const cpu = cpuOptions[Math.floor(Math.random() * cpuOptions.length)];
  const ram = ramOptions[Math.floor(Math.random() * ramOptions.length)];
  const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
  const type = storageType[Math.floor(Math.random() * storageType.length)];

  data.push({
    id: i,
    title: `محصول ${i}`,
    price: Math.floor(Math.random() * 5000) + 100,
    specs: `پردازنده: ${cpu}, رم: ${ram}GB, حافظه: ${storage}GB ${type}`,
    rating: (Math.random() * 5).toFixed(1), 
    url: `https://placehold.co/600x400/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=محصول+${i}`,
    thumbnailUrl: `https://placehold.co/150x100/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=P${i}`
  });
}

export default data;
