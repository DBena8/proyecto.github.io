
function mostrarEquiposLeyenda(estado, equipos){
    const leyenda = d3.select("#leyenda");
    const equipos_filtrados = equipos.filter(equipo => equipo.estado === estado);

    if(equipos_filtrados.length >0){
        equipos_filtrados.forEach(equipo => {
            leyenda.append("p").html(`<strong>${equipo.Equipo}</strong>`)
        });
    } else {
        leyenda.append("p").html("No se encontraron equipos en este estado");
    }
}
async function CrearMapaUSA(mapa_usa){
    const svg = d3.select("#mapa-contenedor").append("svg")
        .attr("width", 800)
        .attr("height", 300)
    const contenedor_mapa = svg.append("g");
    
    function zoomed(event){
        contenedor_mapa.attr("transform", event.transform);
    }
    const tooltip = d3.select("#leyenda");
    
    const m_usa = d3.geoIdentity()
        .reflectY(true)
        .fitSize([800, 500], mapa_usa);
    
    const path = d3.geoPath().projection(m_usa);

    if(!mapa_usa || !mapa_usa.features){
        console.error("No se encontraron los datos del mapa");
        return;
    }

    contenedor_mapa.selectAll("path")
        .data(mapa_usa.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "steelgreen")
        .attr("stroke", "white")
        .on("click", function(event, d){
            const estado = d.properties.name || "Desconocido";
            tooltip.style("opacity", 1)
                .html(estado)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
            }
        );
    svg.call(d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed));
}

async function init() {
    const datos_mapa = d3.json("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json")
                        .catch(err => console.log(err));
    const mapa_usa = await datos_mapa;
    CrearMapaUSA(mapa_usa);
}
init()