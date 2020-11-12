var runningOnChrome = typeof chrome != 'undefined' && typeof browser == 'undefined';
var runningOnFirefox = typeof chrome != 'undefined' && typeof browser != 'undefined';
//
var browser = browser || null;
if (runningOnChrome) browser = chrome;

//////////////////////////////////////////////////////////////////////////////

// Klei's DishNumber amd SelectDish function, not mine.
// I just modified it
var discovered_dishes = {}; // for imporve performance
const coin_names = ["Old Coin", "Sapphire Medallion", "Red Mark", "Gnaw's Favor"];
const craving_names = {
  "snack": "Snack",
  "soup": "Soup",
  "veggie": "Veggie",
  "fish": "Fish",
  "bread": "Bread",
  "meat": "Meat",
  "cheese": "Cheese",
  "pasta": "Pasta",
  "sweet": "Dessert"
}
const cooking_station_names = {
  pot: "Cookpot",
  oven: "Oven",
  grill: "Grill"
}
function OrdinalNumber(number) {
  return number + "<span class='ordinal'>" + OrdinalSuffix(number) + "</span>"
}
function OrdinalSuffix(number) {
  var ordinal = "";
  var last_digit = number.toString().slice(-1);
  switch (last_digit) {
    case '1':
      ordinal = 'st';
      break;
    case '2':
      ordinal = 'nd';
      break;
    case '3':
      ordinal = 'rd';
      break;
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      ordinal = 'th';
      break;
  }
  return ordinal;
}
function DishNumber(number) {
  if (number == 70) return "**";
  return (number < 10) ? "0" + number : number;
}

const ingredient_names = {
  "quagmire_foliage_cooked": "Foliage",
  "quagmire_onion_cooked": "Onion",
  "quagmire_carrot_cooked": "Carrot",
  "quagmire_mushrooms_cooked": "Mushroom",
  "quagmire_crabmeat_cooked": "Crab Meat",
  "quagmire_potato_cooked": "Potato",
  "quagmire_salmon_cooked": "Salmon",
  "quagmire_cookedsmallmeat": "Meat Scraps",
  "twigs": "Twigs",
  "quagmire_turnip_cooked": "Turnip",
  "quagmire_sap": "Sap",
  "rocks": "Rocks",
  "quagmire_goatmilk": "Goat Milk",
  "quagmire_syrup": "Syrup",
  "quagmire_flour": "Flour",
  "quagmire_garlic_cooked": "Garlic",
  "berries_cooked": "Berries",
  "cookedmeat": "Meat",
  "quagmire_tomato_cooked": "Toma Root",
  "quagmire_spotspice_ground": "Spot Spice"
}
function ShowDish(dish_elem) {
  // Set these classes to the corresponding icon on the details panel
  let icon_classes = $(dish_elem).attr("class");
  $(".recipedetails .dish").attr("class", icon_classes);

  // Set the dish number
  let index = parseInt($(dish_elem).attr("data-index"));
  $(".recipedetails .dish-number").text(DishNumber(index));

  // Set the dish icon
  let img = $(dish_elem).find(".dish-icon").attr("style");
  $(".recipedetails .dish-icon").attr("style", img)
    .parent().removeClass('selected')
    .removeClass('invisible').removeClass('translucent');

  // Get dish data
  let dish_data = discovered_dishes[index];
  if (dish_data) {
    // This dish has been discovered!
    $(".recipedetails").removeClass("unknown");
    $(".recipedetails .dish-name").text(dish_data.name);

    // Check its tribute value
    $(".recipedetails .dish .tribute-icon").attr("class", "tribute-icon");
    let first = true;
    let empty = true;
    for (let coin_index = 0; coin_index < 4; coin_index++) {
      if (discovered_dishes[index].coins[coin_index] > 0) {
        $(".recipedetails .dish-tribute .coin" + (coin_index + 1)).addClass("visible");
        $(".recipedetails .dish-tribute .coin" + (coin_index + 1) + " .value").text(discovered_dishes[index].coins[coin_index]);
        if (first) {
          $(".recipedetails .dish .tribute-icon").addClass("coin" + (coin_index + 1) + " visible");
          $(".recipedetails .dish .tribute-icon").attr("title", coin_names[coin_index]);
          first = false;
        }
        empty = false;
      } else {
        $(".recipedetails .dish-tribute .coin" + (coin_index + 1)).removeClass("visible");
      }
    }
    $(".recipedetails .dish-tribute .empty").text((index == 70) ? "None" : "Unknown");
    if (empty) {
      $(".recipedetails .dish-tribute .empty").show();
    } else {
      $(".recipedetails .dish-tribute .empty").hide();
    }

    // Check its plate tribute value
    $(".recipedetails .dish .plating-tribute-icon").attr("class", "plating-tribute-icon");
    first = true;
    empty = true;
    for (let coin_index = 3; coin_index >= 0; coin_index--) {
      if (discovered_dishes[index].silver_coins[coin_index] > 0) {
        $(".recipedetails .dish-plate .coin" + (coin_index + 1)).addClass("visible");
        $(".recipedetails .dish-plate .coin" + (coin_index + 1) + " .value").text(discovered_dishes[index].silver_coins[coin_index]);
        if (first) {
          $(".recipedetails .dish .plating-tribute-icon").addClass("coin" + (coin_index + 1) + " visible");
          $(".recipedetails .dish .plating-tribute-icon").attr("title", coin_names[coin_index]);
          first = false;
        }
        empty = false;
      } else {
        $(".recipedetails .dish-plate .coin" + (coin_index + 1)).removeClass("visible");
      }
    }
    $(".recipedetails .dish-plate .empty").text((index == 70) ? "None" : "Unknown");
    if (empty) {
      $(".recipedetails .dish-plate .empty").show();
    } else {
      $(".recipedetails .dish-plate .empty").hide();
    }

    // Check its cravings info
    let cravings_text = "";
    if (discovered_dishes[index].cravings) {
      for (let craving_index = 0; craving_index < discovered_dishes[index].cravings.length; craving_index++) {
        cravings_text += craving_names[discovered_dishes[index].cravings[craving_index]] + ", ";
      }
    }
    if (cravings_text.length == 0) {
      cravings_text = (index == 70) ? "None" : "Unknown";
    } else {
      cravings_text = cravings_text.substring(0, cravings_text.length - 2);
    }
    $(".recipedetails .dish-craving .value").text(cravings_text);

    // Check its cooking stations
    let stations_text = "";
    for (let station_index = 0; station_index < discovered_dishes[index].station.length; station_index++) {
      stations_text += cooking_station_names[discovered_dishes[index].station[station_index]] + ", ";
    }
    stations_text = stations_text.substring(0, stations_text.length - 2);
    $(".recipedetails .dish-station .value").text(stations_text);
    $(".recipedetails .dish .cooking-station-icon").text("");
    $(".recipedetails .dish .cooking-station-icon").append($(dish_elem).find(".cooking-station-icon").html());

    // List this dish's most popular recipes
    $(".recipedetails .dish-recipes .dish-attribute-content").text("");
    for (let recipe_index = 0; recipe_index < discovered_dishes[index].ingredients.length; recipe_index++) {
      let recipe = discovered_dishes[index].ingredients[recipe_index];
      let recipe_html = "<div class='dish-recipe'>";
      let recipe_pos = (recipe_index > 0) ? (recipe_index + 1) + OrdinalSuffix(recipe_index + 1) + " " : "";
      recipe_html += "<span class='rank-pos' title='This is the " + recipe_pos + "most popular way to cook this dish.'>" + OrdinalNumber(recipe_index + 1) + "</span>";
      // Go through the ingredients
      for (let ingredient_index = 0; ingredient_index < recipe.length; ingredient_index++) {
        recipe_html += "<span class='ingredient " + recipe[ingredient_index] + "' title='" + ingredient_names[recipe[ingredient_index]] + "'></span>";
      }
      recipe_html += "</div>";
      $(".recipedetails .dish-recipes .dish-attribute-content").append(recipe_html);
    }

    $(".recipedetails .dish-finder .value").text("");
    if (discovered_dishes[index].finder) {
      for (let finder_index = 0; finder_index < discovered_dishes[index].finder.length; finder_index++) {
        let finder_username = discovered_dishes[index].finder[finder_index];
        if (finder_username.length > 1) {
          $(".recipedetails .dish-finder .value").append("<span class='unknown-user' title='This recipe was originally discovered by " + finder_username + "'>" + finder_username + "</span>");
        } else {
          $(".recipedetails .dish-finder .value").append("<span title='This recipe was originally discovered by a nameless someone.'>Someone</span>");
        }
      }
    } else {
      $(".recipedetails .dish-finder .value").append("<span title='This recipe was originally discovered by a nameless someone.'>Someone</span>");
    }

    let dish_size_class = (discovered_dishes[index].ingredients[0].length == 4) ? "large-dish" : "small-dish";
    $(dish_elem).addClass(dish_size_class);

  }
}

//////////////////////////////////////////////////////////////////////////////

// waitUntilLoadingComplete
addEventListener('TGRF', e => {
  browser.storage.sync.get(['dishDisplayMode'], data => {
    let options = {
      discovered_dishes: e.detail.discovered_dishes,
      dishDisplayModeDefault:
        data.dishDisplayMode == "dish-display-mode-opacity"
    };
    //
    discovered_dishes = options.discovered_dishes; // for imporve performance
    // call main
    main(options);
  });
}, { once: true, capture: false });

// this is the code which will be injected into a given page...
function main(options) {
  // options
  let dishDisplayModeDefault = options.dishDisplayModeDefault;
  let discovered_dishes = options.discovered_dishes;
  // translate
  let translateToUserLanguage = text => browser.i18n.getMessage(text);
  let t = translateToUserLanguage;

  /////////////////////////////////////////////

  const stations = ["pot", "oven", "grill"];
  let btn_station_div = $('<div/>', {class: 'btn_station_div'});
  for (let station of stations) {
    let label = document.createElement("label");
    label.setAttribute('class', "button");
    label.setAttribute('for', station);
    label.innerText = t(station);
    let checkbox = document.createElement("input");
    checkbox.setAttribute('id', station);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('class', 'invisible');
    checkbox.classList.add('station_btn');
    btn_station_div.append(checkbox);
    btn_station_div.append(label);
  }

  const categories = [
    "all", "snack", "bread", "veggie", "soup",
    "fish", "meat", "cheese", "pasta", "sweet"
  ];
  let btn_cat_div = $('<div/>', {class: 'btn_cat_div'});
  for (let category of categories) {
    let label = document.createElement("label");
    label.setAttribute('class', "button");
    label.setAttribute('for', category);
    label.innerText = t(category);
    let radio = document.createElement("input");
    radio.setAttribute('id', category);
    radio.setAttribute('type', 'radio');
    radio.setAttribute('class', 'invisible');
    radio.classList.add('cat_btn');
    radio.setAttribute('name', 'category');
    if (category == 'all') radio.checked = true; // default
    btn_cat_div.append(radio);
    btn_cat_div.append(label);
  }

  let div_all_btns = $('<div id="filter-button"/>');
  div_all_btns.append(btn_cat_div);
  div_all_btns.append(btn_station_div);
  $('.recipelist').prepend(div_all_btns);

  ////////////////////////////////////////////

  // no br element
  $('.recipelist-dishes > br').remove();

  // use klei's recipe
  let dishData = discovered_dishes;

  //
  let lastClickDish = 0;
  let lastHighLight = 0;
  
  let dishElement = $('.recipelist-dishes > li');

  let currentCategory = 'all';
  let currentStationStatus = { pot: false, oven: false, grill: false }
  $('.station_btn').on('change', e => {
    currentStationStatus[e.target.id] = e.target.checked;
    highlight();
    // relocateClickDish
    if (dishElement.eq(lastClickDish).hasClass('lowpoint'))
      $('.recipelist-dishes > li:not(.lowpoint)').first()[0].click();
  });
  $('.cat_btn').on('change', e => {
    currentCategory = e.target.id;
    highlight();
    // relocateClickDish
    if (dishElement.eq(lastClickDish).hasClass('lowpoint'))
      $('.recipelist-dishes > li:not(.lowpoint)').first()[0].click();
  });

  $('.recipelist-dishes > li,\
	.recipelist-dishes > li > icon-container > *').click(e => {
    let index = Number.parseInt(e.target.getAttribute("dish")
      || e.target.parentElement.getAttribute("dish")
      || e.target.parentElement.parentElement.getAttribute("dish")
      || e.target.parentElement.parentElement.parentElement
      .getAttribute("dish")) - 1;
    if (!isNaN(index)) {
      if (dishElement.eq(index).hasClass('lowpoint'))
        return;
      dishElement.eq(lastHighLight).removeClass('selected');
      dishElement.eq(index).addClass('selected');
      ShowDish(dishElement[index]);
      lastHighLight = lastClickDish = index;
    }
  });
  $('.recipelist-dishes > li,\
	.recipelist-dishes > li > icon-container > *').hover(e => {
    let index = Number.parseInt(e.target.getAttribute("dish")
      || e.target.parentElement.getAttribute("dish")
      || e.target.parentElement.parentElement.getAttribute("dish")
      || e.target.parentElement.parentElement.parentElement
        .getAttribute("dish")) - 1;
    if (!isNaN(index)) {
      if (dishElement.eq(index).hasClass('lowpoint'))
        return;		
      dishElement.eq(lastHighLight).removeClass('selected');
      dishElement.eq(index).addClass('selected');
      lastHighLight = index;
      ShowDish(dishElement[index]);
    }
  }, e => {
    dishElement.eq(lastHighLight).removeClass('selected');
    dishElement.eq(lastClickDish).addClass('selected');
    lastHighLight = lastClickDish;
    ShowDish(dishElement[lastClickDish]);
  });

  // default
  dishElement[lastClickDish].childNodes[0].click();

  let dishes = document.querySelectorAll('.recipelist-dishes > *');
  function highlight() {
    for (let id = 1; id < 71; ++id) {
      let dish = dishes[id - 1]; // domElement array is zero start
      //
      let currentStationAll = !currentStationStatus.pot
        && !currentStationStatus.oven && !currentStationStatus.grill;
      // normal dish
      let needHighlight = ((dishData[id].cravings != null
          && (currentCategory == 'all'
            || dishData[id].cravings.indexOf(currentCategory) != -1))
          // this is not a bug because all dishes has only one station
          && (currentStationAll || currentStationStatus[dishData[id].station[0]]))
        // dish 70
        || (dishData[id].cravings == null
          && currentStationAll && currentCategory == 'all');

      if (dishDisplayModeDefault) {
        if (needHighlight)
          $(dish).removeClass('lowpoint').removeClass('translucent');
        else $(dish).addClass('lowpoint').addClass('translucent');
      } else {
        if (needHighlight)
          $(dish).removeClass('lowpoint').removeClass('invisible');
        else $(dish).addClass('lowpoint').addClass('invisible');
      }
    }
  }
}
