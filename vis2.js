//*************************** Assignment 3 ***************************//
async function fetchData() {
  const data = await d3.csv("A3/videogames_wide.csv");
  return data;
}

fetchData().then(async (data) => {
    // Visualization 1: Global Sales by Genre and Platform //
    const vlSpec1 = vl 
    .markBar()
    .data(data)
    .transform(
        vl.aggregate(
        [{ op: "sum", field: "Global_Sales", as: "Total Sales" }]
        ).groupby(["Platform", "Genre"])
    )
    .encode(
        vl.x().fieldN("Platform"),
        vl.y().fieldN("Genre"),
        vl.color().fieldQ("Total Sales").aggregate("sum").scale({ scheme: "purplebluegreen"}).title("Sales (in millions)"),
        vl.tooltip([
            vl.fieldN("Platform"),
            vl.fieldN("Genre"),
            vl.fieldQ("Total Sales")
        ])
    )
    .width(850).height(450)
    .title("Global Sales by Platform and Genre")
    .toSpec();

    // Visualization 2: Sales Over Time by Platform and Genre //
    const genres = [...new Set(data.map(d => d.Genre))];  // Gets genres //

    const selectGenre = vl.selectPoint('Select')
    .fields(['Genre'])
    .init({ Genre: genres[0] })
    .bind(vl.menu(genres));

    const vlSpec2 = vl
    .markPoint({ filled: true, size: 80 })
    .data(data)
    .transform(
        vl.filter("isValid(datum.Year) && datum.Year != 'N/A'"),
        vl.aggregate([
        { op: "sum", field: "Global_Sales", as: "Total Sales" }
        ]).groupby(["Year", "Platform", "Genre"])
    )
    .params(selectGenre)
    .encode(
        vl.x().fieldO("Year").title("Year"),
        vl.y().fieldQ("Total Sales").aggregate("sum").title("Global Sales (millions)"),
        vl.color().fieldN("Platform").title("Platform"),
        vl.opacity().if(selectGenre, vl.value(1)).value(0.1),
        vl.tooltip([
            vl.fieldN("Year"),
            vl.fieldN("Platform"),
            vl.fieldN("Genre"),
            vl.fieldQ("Total Sales")
        ])
    )
    .width(800).height(600)
    .title("Global Sales over time by Platform and Genre (Selectable)")
    .toSpec();

    // Visualization 3: Regional Sales vs. Platform //
    const vlSpec3 = vl
    .markRect()
    .data(data)
    .transform(
      vl.fold(["NA_Sales", "JP_Sales", "EU_Sales", "Other_Sales"])
        .as(["region", "Sales"]),
      vl.calculate("replace(datum.region, '_Sales', '')")
        .as("Region"),
      vl.aggregate([
      { op: "sum", field: "Sales", as: "Sales" }
    ]).groupby(["Region", "Platform"])
    )
    .encode(
      vl.x().fieldN("Platform"),
      vl.y().fieldN("Region").title("Total Sales (millions)"),
      vl.color().fieldQ("Sales").aggregate("sum").title("Region"),
      vl.tooltip([
        vl.fieldN("Region"),
        vl.fieldN("Platform"),
        vl.fieldQ("Sales"),
      ])
    )
    .width(850).height(450)
    .title("Regional Sales by Platform")
    .toSpec();

    // Visualization 4: Tell a Visual Story //
    const vlSpec4 = vl
    .markLine()
    .data(data)
    .transform(
      vl.filter(selectGenre),
      vl.filter("isValid(datum.Year) && datum.Year != 'N/A'"),
      vl.fold(["NA_Sales", "JP_Sales", "EU_Sales", "Other_Sales"])
        .as(["Region", "Sales"]),
      vl.aggregate([
      { op: "sum", field: "Sales", as: "Sales" }
    ]).groupby(["Region", "Year"])
    )
    .params(selectGenre)
    .encode(
      vl.x().fieldO("Year"),
      vl.y().fieldQ("Sales").aggregate("sum").title("Total Sales (millions)"),
      vl.color().fieldN("Region").title("Region"),
      vl.tooltip([
        vl.fieldN("Region"),
        vl.fieldN("Year"),
        vl.fieldQ("Sales"),
      ])
    )
    .width(850).height(450)
    .title("Regional Sales over time by Genre (Selectable)")
    .toSpec();


  render("#globalSalesChart", vlSpec1);
  render("#salesOverTimeChart", vlSpec2);
  render("#regionalSalesChart", vlSpec3);
  render("#vizChart", vlSpec4);
});

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}
