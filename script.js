const initialDeliveries = [
  { id: 1001, client: "Mariana Costa", destination: "Adrianópolis, Manaus", date: "2026-10-15", status: "Em transporte" },
  { id: 1002, client: "Lucas Ferreira", destination: "Centro, Manaus", date: "2026-10-15", status: "Pendente" },
  { id: 1003, client: "Camila Souza", destination: "Parque 10, Manaus", date: "2026-10-16", status: "Em transporte" },
  { id: 1004, client: "Rafael Lima", destination: "Flores, Manaus", date: "2026-10-14", status: "Entregue" }
];

let deliveries = [...initialDeliveries];
const rows = document.getElementById("deliveryRows");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const form = document.getElementById("deliveryForm");

function formatDate(dateString) {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}
function statusClass(status) {
  if (status === "Pendente") return "status-pendente";
  if (status === "Em transporte") return "status-transporte";
  return "status-entregue";
}
function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}
function render() {
  const term = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const filtered = deliveries.filter(item =>
    (item.client.toLowerCase().includes(term) || item.destination.toLowerCase().includes(term) || String(item.id).includes(term)) &&
    (selectedStatus === "Todos" || item.status === selectedStatus)
  );
  document.getElementById("totalCount").textContent = deliveries.length;
  document.getElementById("pendingCount").textContent = deliveries.filter(item => item.status === "Pendente").length;
  document.getElementById("transitCount").textContent = deliveries.filter(item => item.status === "Em transporte").length;
  document.getElementById("deliveredCount").textContent = deliveries.filter(item => item.status === "Entregue").length;
  document.getElementById("resultCount").textContent = `Mostrando ${filtered.length} ${filtered.length === 1 ? "entrega" : "entregas"}`;
  rows.innerHTML = "";
  if (!filtered.length) {
    rows.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:28px;color:#9aa2b1">Nenhuma entrega encontrada. Tente outra busca.</td></tr>';
    return;
  }
  filtered.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><div class="customer"><span class="customer-avatar">${initials(item.client)}</span><div><strong>${escapeHTML(item.client)}</strong><small>Pedido #${item.id}</small></div></div></td>
      <td>${escapeHTML(item.destination)}</td>
      <td>${formatDate(item.date)}</td>
      <td><span class="status ${statusClass(item.status)}">${item.status}</span></td>
      <td><select class="action-select" aria-label="Alterar status do pedido ${item.id}" data-id="${item.id}"><option ${item.status==="Pendente"?"selected":""}>Pendente</option><option ${item.status==="Em transporte"?"selected":""}>Em transporte</option><option ${item.status==="Entregue"?"selected":""}>Entregue</option></select></td>`;
    rows.appendChild(tr);
  });
  rows.querySelectorAll(".action-select").forEach(select => {
    select.addEventListener("change", event => {
      const id = Number(event.target.dataset.id);
      const delivery = deliveries.find(item => item.id === id);
      if (delivery) delivery.status = event.target.value;
      render();
    });
  });
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[character]));
}
document.getElementById("showFormBtn").addEventListener("click", () => {
  form.classList.remove("hidden");
  document.getElementById("clientInput").focus();
});
document.getElementById("closeFormBtn").addEventListener("click", () => form.classList.add("hidden"));
form.addEventListener("submit", event => {
  event.preventDefault();
  const nextId = deliveries.length ? Math.max(...deliveries.map(item => item.id)) + 1 : 1001;
  deliveries.unshift({
    id: nextId,
    client: document.getElementById("clientInput").value.trim(),
    destination: document.getElementById("destinationInput").value.trim(),
    date: document.getElementById("dateInput").value,
    status: document.getElementById("newStatus").value
  });
  form.reset();
  form.classList.add("hidden");
  searchInput.value = "";
  statusFilter.value = "Todos";
  render();
});
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);
render();
