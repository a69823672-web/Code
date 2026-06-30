let products = JSON.parse(localStorage.getItem("products")) || [];
let logo = localStorage.getItem("logo") || "";
let currentCat = "همه";
let editIndex = null;

const cats = [
"همه",
"نوشیدنی گرم بر پایه قهوه",
"نوشیدنی سرد بر پایه قهوه",
"نوشیدنی شرکتی",
"تنقلات",
"سایر",
"غذای حاضری",
"نوشیدنی گرم"
];

function setLogo(e){
  const file = e.target.files[0];
  const r = new FileReader();
  r.onload = ()=>{
    logo = r.result;
    localStorage.setItem("logo", logo);
    document.getElementById("logoPreview").src = logo;
  }
  r.readAsDataURL(file);
}

function renderCats(){
  const c = document.getElementById("cats");
  c.innerHTML = "";

  cats.forEach(cat=>{
    const d = document.createElement("div");
    d.className = "cat" + (cat==currentCat?" active":"");
    d.innerText = cat;
    d.onclick = ()=>{currentCat=cat;render();renderCats();}
    c.appendChild(d);
  });
}

function render(){
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  products
  .filter(p=>currentCat=="همه" || p.category==currentCat)
  .forEach((p,i)=>{
    menu.innerHTML += `
      <div class="item">
        <b>${p.name}</b> - ${p.price} تومان
        ${p.img?`<img src="${p.img}">`:""}
        ${p.video?`<video controls src="${p.video}"></video>`:""}

        <div class="actions">
          <button class="edit" onclick="editProduct(${i})">ویرایش</button>
          <button class="del" onclick="deleteProduct(${i})">حذف</button>
        </div>
      </div>
    `;
  });

  document.getElementById("logoPreview").src = logo;
}

function openAdmin(){
  document.getElementById("panel").style.display="block";
}

function checkPass(){
  if(pass.value=="4030"){
    adminArea.style.display="block";
  } else {
    alert("رمز اشتباه");
  }
}

function toBase64(file){
  return new Promise(res=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.readAsDataURL(file);
  });
}

async function addOrUpdate(){

  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const imgInput = document.getElementById("img");
  const videoInput = document.getElementById("video");
  const catInput = document.getElementById("category");

  if(!nameInput.value || !priceInput.value){
    alert("نام و قیمت را وارد کن");
    return;
  }

  let product = {
    name: nameInput.value,
    price: priceInput.value,
    category: catInput.value,
    img: "",
    video: ""
  };

  if(imgInput.files[0]) product.img = await toBase64(imgInput.files[0]);
  if(videoInput.files[0]) product.video = await toBase64(videoInput.files[0]);

  if(editIndex !== null){
    products[editIndex] = product;
    editIndex = null;
  } else {
    products.push(product);
  }

  localStorage.setItem("products", JSON.stringify(products));

  nameInput.value="";
  priceInput.value="";
  imgInput.value="";
  videoInput.value="";

  render();
}

function deleteProduct(i){
  products.splice(i,1);
  localStorage.setItem("products", JSON.stringify(products));
  render();
}

function editProduct(i){
  const p = products[i];

  document.getElementById("name").value = p.name;
  document.getElementById("price").value = p.price;
  document.getElementById("category").value = p.category;

  editIndex = i;
}

document.getElementById("logoPreview").src = logo;

renderCats();
render();
