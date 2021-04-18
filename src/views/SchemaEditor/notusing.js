import React from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import "./SchemaEditor.css";

import ConnectElements from 'react-connect-elements';

const mySavedModel = {
  class: "go.TreeModel",
  nodeDataArray: [
    { key: 1, name: "Stella Payne Diaz", title: "CEO" },
    { key: 2, name: "Luke Warm", title: "VP Marketing/Sales", parent: 1 },
    { key: 3, name: "Meg Meehan Hoffa", title: "Sales", parent: 2 },
    { key: 4, name: "Peggy Flaming", title: "VP Engineering", parent: 1 },
    { key: 5, name: "Saul Wellingood", title: "Manufacturing", parent: 4 },
    { key: 6, name: "Al Ligori", title: "Marketing", parent: 2 },
    // { key: 7, name: "Dot Stubadd", title: "Sales Rep", parent: 3 },
    // { key: 8, name: "Les Ismore", title: "Project Mgr", parent: 5 },
    // { key: 9, name: "April Lynn Parris", title: "Events Mgr", parent: 6 },
    // { key: 10, name: "Xavier Breath", title: "Engineering", parent: 4 },
    // { key: 11, name: "Anita Hammer", title: "Process", parent: 5 },
    // { key: 12, name: "Billy Aiken", title: "Software", parent: 10 },
    // { key: 13, name: "Stan Wellback", title: "Testing", parent: 10 },
    // { key: 14, name: "Marge Innovera", title: "Hardware", parent: 10 },
    // { key: 15, name: "Evan Elpus", title: "Quality", parent: 5 },
    // { key: 16, name: "Lotta B. Essen", title: "Sales Rep", parent: 3 },
  ],
};

const SchemaEditor = () => {
  React.useEffect(() => {

  var $ = go.GraphObject.make; // for conciseness in defining templates

  let myDiagram = $(
    go.Diagram,
    "myDiagramDiv", // must be the ID or reference to div
    {
      maxSelectionCount: 1, // users can select only one part at a time
      validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
      // "clickCreatingTool.archetypeNodeData": {
      //   // allow double-click in background to create a new node
      //   name: "(new person)",
      //   title: "",
      //   comments: "",
      // },
      "clickCreatingTool.insertPart": function (loc) {
        // scroll to the new node
        var node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
        if (node !== null) {
          this.diagram.select(node);
          this.diagram.commandHandler.scrollToPart(node);
          this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
        }
        return node;
      },
      layout: $(go.TreeLayout, {
        treeStyle: go.TreeLayout.StyleLastParents,
        arrangement: go.TreeLayout.ArrangementHorizontal,
        // properties for most of the tree:
        angle: 90,
        layerSpacing: 35,
        // properties for the "last parents":
        alternateAngle: 90,
        alternateLayerSpacing: 35,
        alternateAlignment: go.TreeLayout.AlignmentBus,
        alternateNodeSpacing: 20,
      }),
      "undoManager.isEnabled": true, // enable undo & redo
    }
  );

  // manage boss info manually when a node or link is deleted from the diagram
  myDiagram.addDiagramListener("SelectionDeleting", function (e) {
    var part = e.subject.first(); // e.subject is the myDiagram.selection collection,
    // so we'll get the first since we know we only have one selection
    myDiagram.startTransaction("clear boss");
    if (part instanceof go.Node) {
      var it = part.findTreeChildrenNodes(); // find all child nodes
      while (it.next()) {
        // now iterate through them and clear out the boss information
        var child = it.value;
        var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
        if (bossText === null) return;
        bossText.text = "";
      }
    } else if (part instanceof go.Link) {
      var child = part.toNode;
      var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
      if (bossText === null) return;
      bossText.text = "";
    }
    myDiagram.commitTransaction("clear boss");
  });

  var levelColors = [
    "#AC193D",
    "#2672EC",
    "#8C0095",
    "#5133AB",
    "#008299",
    "#D24726",
    "#008A00",
    "#094AB2",
  ];

  // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
  myDiagram.layout.commitNodes = function () {
    go.TreeLayout.prototype.commitNodes.call(myDiagram.layout); // do the standard behavior
    // then go through all of the vertexes and set their corresponding node's Shape.fill
    // to a brush dependent on the TreeVertex.level value
    myDiagram.layout.network.vertexes.each(function (v) {
      if (v.node) {
        var level = v.level % levelColors.length;
        var color = levelColors[level];
        var shape = v.node.findObject("SHAPE");
        if (shape)
          shape.stroke = $(go.Brush, "Linear", {
            0: color,
            1: go.Brush.lightenBy(color, 0.05),
            start: go.Spot.Left,
            end: go.Spot.Right,
          });
      }
    });
  };

  // when a node is double-clicked, add a child to it
  function nodeDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
      var thisemp = clicked.data;
      myDiagram.startTransaction("add employee");
      var newemp = {
        name: "(new person)",
        title: "",
        comments: "",
        parent: thisemp.key,
      };
      myDiagram.model.addNodeData(newemp);
      myDiagram.commitTransaction("add employee");
    }
  }

  // this is used to determine feedback during drags
  function mayWorkFor(node1, node2) {
    if (!(node1 instanceof go.Node)) return false; // must be a Node
    if (node1 === node2) return false; // cannot work for yourself
    if (node2.isInTreeOf(node1)) return false; // cannot work for someone who works for you
    return true;
  }

  // This function provides a common style for most of the TextBlocks.
  // Some of these values may be overridden in a particular TextBlock.
  function textStyle() {
    return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
  }

  // This converter is used by the Picture.
  function findHeadShot(key) {
    if (key < 0 || key > 16) return "images/HSnopic.jpg"; // There are only 16 images on the server
    return "images/HS" + key + ".jpg";
  }

  // define the Node template
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    { doubleClick: nodeDoubleClick },
    {
      // handle dragging a Node onto a Node to (maybe) change the reporting relationship
      mouseDragEnter: function (e, node, prev) {
        var diagram = node.diagram;
        var selnode = diagram.selection.first();
        if (!mayWorkFor(selnode, node)) return;
        var shape = node.findObject("SHAPE");
        if (shape) {
          shape._prevFill = shape.fill; // remember the original brush
          shape.fill = "darkred";
        }
      },
      mouseDragLeave: function (e, node, next) {
        var shape = node.findObject("SHAPE");
        if (shape && shape._prevFill) {
          shape.fill = shape._prevFill; // restore the original brush
        }
      },
      mouseDrop: function (e, node) {
        var diagram = node.diagram;
        var selnode = diagram.selection.first(); // assume just one Node in selection
        if (mayWorkFor(selnode, node)) {
          // find any existing link into the selected node
          var link = selnode.findTreeParentLink();
          if (link !== null) {
            // reconnect any existing link
            link.fromNode = node;
          } else {
            // else create a new link
            diagram.toolManager.linkingTool.insertLink(
              node,
              node.port,
              selnode,
              selnode.port
            );
          }
        }
      },
    },
    // for sorting, have the Node.text be the data.name
    new go.Binding("text", "name"),
    // bind the Part.layerName to control the Node's layer depending on whether it isSelected
    new go.Binding("layerName", "isSelected", function (sel) {
      return sel ? "Foreground" : "";
    }).ofObject(),
    // define the node's outer shape
    $(go.Shape, "Rectangle", {
      name: "SHAPE",
      fill: "#333333",
      stroke: "white",
      strokeWidth: 3.5,
      // set the port properties:
      portId: "",
      fromLinkable: true,
      toLinkable: true,
      cursor: "pointer",
    }),
    $(
      go.Panel,
      "Horizontal",
      $(
        go.Picture,
        {
          name: "Picture",
          desiredSize: new go.Size(70, 70),
          margin: 1.5,
        },
        new go.Binding("source", "key", findHeadShot)
      ),
      // define the panel where the text will appear
      $(
        go.Panel,
        "Table",
        {
          minSize: new go.Size(130, NaN),
          maxSize: new go.Size(150, NaN),
          margin: new go.Margin(6, 10, 0, 6),
          defaultAlignment: go.Spot.Left,
        },
        $(go.RowColumnDefinition, { column: 2, width: 4 }),
        $(
          go.TextBlock,
          textStyle(), // the name
          {
            row: 0,
            column: 0,
            columnSpan: 5,
            font: "12pt Segoe UI,sans-serif",
            editable: true,
            isMultiline: false,
            minSize: new go.Size(10, 16),
          },
          new go.Binding("text", "name").makeTwoWay()
        ),
        $(go.TextBlock, "Title: ", textStyle(), { row: 1, column: 0 }),
        $(
          go.TextBlock,
          textStyle(),
          {
            row: 1,
            column: 1,
            columnSpan: 4,
            editable: true,
            isMultiline: false,
            minSize: new go.Size(10, 14),
            margin: new go.Margin(0, 0, 0, 3),
          },
          new go.Binding("text", "title").makeTwoWay()
        ),
        $(
          go.TextBlock,
          textStyle(),
          { row: 2, column: 0 },
          new go.Binding("text", "key", function (v) {
            return "ID: " + v;
          })
        ),
        $(
          go.TextBlock,
          textStyle(),
          { name: "boss", row: 2, column: 3 }, // we include a name so we can access this TextBlock when deleting Nodes/Links
          new go.Binding("text", "parent", function (v) {
            return "Boss: " + v;
          })
        ),
        $(
          go.TextBlock,
          textStyle(), // the comments
          {
            row: 3,
            column: 0,
            columnSpan: 5,
            font: "italic 9pt sans-serif",
            wrap: go.TextBlock.WrapFit,
            editable: true, // by default newlines are allowed
            minSize: new go.Size(10, 14),
          },
          new go.Binding("text", "comments").makeTwoWay()
        )
      ) // end Table Panel
    ) // end Horizontal Panel
  ); // end Node

  // the context menu allows users to make a position vacant,
  // remove a role and reassign the subtree, or remove a department
  myDiagram.nodeTemplate.contextMenu = $(
    "ContextMenu",
    $("ContextMenuButton", $(go.TextBlock, "Vacate Position"), {
      click: function (e, obj) {
        var node = obj.part.adornedPart;
        if (node !== null) {
          var thisemp = node.data;
          myDiagram.startTransaction("vacate");
          // update the key, name, and comments
          myDiagram.model.setDataProperty(thisemp, "name", "(Vacant)");
          myDiagram.model.setDataProperty(thisemp, "comments", "");
          myDiagram.commitTransaction("vacate");
        }
      },
    }),
    $("ContextMenuButton", $(go.TextBlock, "Remove Role"), {
      click: function (e, obj) {
        // reparent the subtree to this node's boss, then remove the node
        var node = obj.part.adornedPart;
        if (node !== null) {
          myDiagram.startTransaction("reparent remove");
          var chl = node.findTreeChildrenNodes();
          // iterate through the children and set their parent key to our selected node's parent key
          while (chl.next()) {
            var emp = chl.value;
            myDiagram.model.setParentKeyForNodeData(
              emp.data,
              node.findTreeParentNode().data.key
            );
          }
          // and now remove the selected node itself
          myDiagram.model.removeNodeData(node.data);
          myDiagram.commitTransaction("reparent remove");
        }
      },
    }),
    $("ContextMenuButton", $(go.TextBlock, "Remove Department"), {
      click: function (e, obj) {
        // remove the whole subtree, including the node itself
        var node = obj.part.adornedPart;
        if (node !== null) {
          myDiagram.startTransaction("remove dept");
          myDiagram.removeParts(node.findTreeParts());
          myDiagram.commitTransaction("remove dept");
        }
      },
    })
  );

  // define the Link template
  myDiagram.linkTemplate = $(
    go.Link,
    go.Link.Orthogonal,
    { corner: 5, relinkableFrom: true, relinkableTo: true },
    $(go.Shape, { strokeWidth: 1.5, stroke: "#F5F5F5" })
  ); // the link shape

  // read in the JSON-format data from the "mySavedModel" element
  load();

  // support editing the properties of the selected person in HTML
  // if (window.Inspector)
  //   myInspector = new Inspector("myInspector", myDiagram, {
  //     properties: {
  //       key: { readOnly: true },
  //       comments: {},
  //     },
  //   });

  // Setup zoom to fit button

// }; // end init

// Show the diagram's model in JSON format
function save() {
  // document.getElementById("mySavedModel").value = myDiagram.model.toJson();
  myDiagram.isModified = false;
}
function load() {
  myDiagram.model = go.Model.fromJson(mySavedModel);
  // make sure new data keys are unique positive integers
  var lastkey = 1;
  myDiagram.model.makeUniqueKeyFunction = function (model, data) {
    var k = data.key || lastkey;
    while (model.findNodeDataForKey(k)) k++;
    data.key = lastkey = k;
    return k;
  };
}
  }, []);

  return (
    // <div className="container">
    //   <header>
    //     <a href="https://github.com/emersonlaurentino/react-connect-elements">
    //       <h1>React Connect Elements</h1>
    //     </a>
    //   </header>
    //   <div className="elements">
    //     <div className="elements-row">
    //       {/* <div className="element element1" /> */}
    //       <SchemaTable className="element1" />
    //       <div className="element element2" />
    //       <div className="element element3" />
    //     </div>
    //     <div className="elements-row">
    //       <div className="element element4" />
    //     </div>
    //     <div className="elements-row">
    //       <div className="element element5" />
    //       <div className="element element6" />
    //       <div className="element element7" />
    //     </div>
    //   </div>
    //   <footer>
    //     <span>
    //       by{" "}
    //       <a href="https://github.com/emersonlaurentino">@emersonlaurentino</a>
    //     </span>
    //   </footer>
    //   <ConnectElements
    //     selector=".elements"
    //     overlay={10}
    //     elements={[
    //       { from: ".element1", to: ".element4" },
    //       { from: ".element2", to: ".element4" },
    //       { from: ".element3", to: ".element4" },
    //       { from: ".element5", to: ".element4" },
    //       { from: ".element6", to: ".element4" },
    //       { from: ".element7", to: ".element4" },
    //     ]}
    //   />
    // </div>
    // <div id="myDiagramDiv"></div>
    <div id="myDiagramDiv"></div>
  );
};

export default SchemaEditor;

const SchemaTable = ({ className  }) => {
  return (
    <div className={`table-container ${className}`}>
      <div className="table-header"></div>
      <div>
        <h2>User Table</h2>
        <div className="table-properties">
          <p>N</p>
          <p>id</p>
          <p>big increments</p>
        </div>
      </div>
    </div>
  );
};

  const model = new go.TreeModel(
    [
      { 'key': 1, 'name': 'Stella Payne Diaz', 'title': 'CEO' },
      { 'key': 2, 'name': 'Luke Warm', 'title': 'VP Marketing/Sales', 'parent': 1 },
      { 'key': 3, 'name': 'Meg Meehan Hoffa', 'title': 'Sales', 'parent': 2 },
      { 'key': 4, 'name': 'Peggy Flaming', 'title': 'VP Engineering', 'parent': 1 },
      { 'key': 5, 'name': 'Saul Wellingood', 'title': 'Manufacturing', 'parent': 4 },
      { 'key': 6, 'name': 'Al Ligori', 'title': 'Marketing', 'parent': 2 },
      { 'key': 7, 'name': 'Dot Stubadd', 'title': 'Sales Rep', 'parent': 3 },
      { 'key': 8, 'name': 'Les Ismore', 'title': 'Project Mgr', 'parent': 5 },
      { 'key': 9, 'name': 'April Lynn Parris', 'title': 'Events Mgr', 'parent': 6 },
      { 'key': 10, 'name': 'Xavier Breath', 'title': 'Engineering', 'parent': 4 },
      { 'key': 11, 'name': 'Anita Hammer', 'title': 'Process', 'parent': 5 },
      { 'key': 12, 'name': 'Billy Aiken', 'title': 'Software', 'parent': 10 },
      { 'key': 13, 'name': 'Stan Wellback', 'title': 'Testing', 'parent': 10 },
      { 'key': 14, 'name': 'Marge Innovera', 'title': 'Hardware', 'parent': 10 },
      { 'key': 15, 'name': 'Evan Elpus', 'title': 'Quality', 'parent': 5 },
      { 'key': 16, 'name': 'Lotta B. Essen', 'title': 'Sales Rep', 'parent': 3 }
    ]
  );


// function initDiagram() {
//   const $ = go.GraphObject.make;
//   // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
//   const diagram = $(go.Diagram, {
//     "undoManager.isEnabled": true, // must be set to allow for model change listening
//     // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
//     "clickCreatingTool.archetypeNodeData": {
//       text: "new node",
//       color: "lightblue",
//     },
//     model: $(go.GraphLinksModel, {
//       linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
//     }),
//     layout: $(go.TreeLayout, {
//       isOngoing: true,
//       treeStyle: go.TreeLayout.StyleLastParents,
//       arrangement: go.TreeLayout.ArrangementHorizontal,
//       // properties for most of the tree:
//       angle: 90,
//       layerSpacing: 35,
//       // properties for the "last parents":
//       alternateAngle: 90,
//       alternateLayerSpacing: 35,
//       alternateAlignment: go.TreeLayout.AlignmentBus,
//       alternateNodeSpacing: 20,
//     }),
//   });

//   // define a simple Node template
//   // diagram.nodeTemplate = $(
//   //   go.Node,
//   //   "Auto", // the Shape will go around the TextBlock
//   //   new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
//   //     go.Point.stringify
//   //   ),
//   //   $(
//   //     go.Shape,
//   //     "RoundedRectangle",
//   //     { name: "SHAPE", fill: "white", strokeWidth: 0 },
//   //     // Shape.fill is bound to Node.data.color
//   //     new go.Binding("fill", "color")
//   //   ),
//   //   $(
//   //     go.TextBlock,
//   //     { margin: 8, editable: true }, // some room around the text
//   //     new go.Binding("text").makeTwoWay()
//   //   )
//   // );

//   // define the Node template
//   diagram.nodeTemplate = $(
//     go.Node,
//     "Auto",
//     // for sorting, have the Node.text be the data.name
//     new go.Binding("text", "name"),
//     // bind the Part.layerName to control the Node's layer depending on whether it isSelected
//     new go.Binding("layerName", "isSelected", function (sel) {
//       return sel ? "Foreground" : "";
//     }).ofObject(),
//     // define the node's outer shape
//     $(
//       go.Shape,
//       "Rectangle",
//       {
//         name: "SHAPE",
//         fill: "lightblue",
//         stroke: null,
//         // set the port properties:
//         portId: "",
//         fromLinkable: true,
//         toLinkable: true,
//         cursor: "pointer",
//       },
//       new go.Binding("fill", "", function (node) {
//         // modify the fill based on the tree depth level
//         const levelColors = [
//           "#AC193D",
//           "#2672EC",
//           "#8C0095",
//           "#5133AB",
//           "#008299",
//           "#D24726",
//           "#008A00",
//           "#094AB2",
//         ];
//         let color = node.findObject("SHAPE").fill;
//         const dia = node.diagram;
//         if (dia && dia.layout.network) {
//           dia.layout.network.vertexes.each(function (v) {
//             if (v.node && v.node.key === node.data.key) {
//               const level = v.level % levelColors.length;
//               color = levelColors[level];
//             }
//           });
//         }
//         return color;
//       }).ofObject()
//     ),
//     $(
//       go.Panel,
//       "Horizontal",
//       $(
//         go.Picture,
//         {
//           name: "Picture",
//           desiredSize: new go.Size(39, 50),
//           margin: new go.Margin(6, 8, 6, 10),
//         },
//         new go.Binding("source", "key", function (key) {
//           if (key < 0 || key > 16) return ""; // There are only 16 images on the server
//           return "assets/HS" + key + ".png";
//         })
//       ),
//       // define the panel where the text will appear
//       $(
//         go.Panel,
//         "Table",
//         {
//           maxSize: new go.Size(150, 999),
//           margin: new go.Margin(6, 10, 0, 3),
//           defaultAlignment: go.Spot.Left,
//         },
//         $(go.RowColumnDefinition, { column: 2, width: 4 }),
//         $(
//           go.TextBlock,
//           { font: "9pt  Segoe UI,sans-serif", stroke: "white" }, // the name
//           {
//             row: 0,
//             column: 0,
//             columnSpan: 5,
//             font: "12pt Segoe UI,sans-serif",
//             editable: true,
//             isMultiline: false,
//             minSize: new go.Size(10, 16),
//           },
//           new go.Binding("text", "name").makeTwoWay()
//         ),
//         $(
//           go.TextBlock,
//           "Title: ",
//           { font: "9pt  Segoe UI,sans-serif", stroke: "white" },
//           { row: 1, column: 0 }
//         ),
//         $(
//           go.TextBlock,
//           { font: "9pt  Segoe UI,sans-serif", stroke: "white" },
//           {
//             row: 1,
//             column: 1,
//             columnSpan: 4,
//             editable: true,
//             isMultiline: false,
//             minSize: new go.Size(10, 14),
//             margin: new go.Margin(0, 0, 0, 3),
//           },
//           new go.Binding("text", "title").makeTwoWay()
//         ),
//         $(
//           go.TextBlock,
//           { font: "9pt  Segoe UI,sans-serif", stroke: "white" },
//           { row: 2, column: 0 },
//           new go.Binding("text", "key", function (v) {
//             return "ID: " + v;
//           })
//         ),
//         $(
//           go.TextBlock,
//           { font: "9pt  Segoe UI,sans-serif", stroke: "white" },
//           { name: "boss", row: 2, column: 3 }, // we include a name so we can access this TextBlock when deleting Nodes/Links
//           new go.Binding("text", "parent", function (v) {
//             return "Boss: " + v;
//           })
//         ),
//         $(
//           go.TextBlock,
//           { font: "9pt  Segoe UI,sans-serif", stroke: "white" }, // the comments
//           {
//             row: 3,
//             column: 0,
//             columnSpan: 5,
//             font: "italic 9pt sans-serif",
//             wrap: go.TextBlock.WrapFit,
//             editable: true, // by default newlines are allowed
//             minSize: new go.Size(10, 14),
//           },
//           new go.Binding("text", "comments").makeTwoWay()
//         )
//       ) // end Table Panel
//     ) // end Horizontal Panel
//   ); // end Node

//   // diagram.model = model;

//   // when the selection changes, emit event to app-component updating the selected node
//   diagram.addDiagramListener("ChangedSelection", (e) => {
//     const node = diagram.selection.first();
//   });
//   return diagram;
// }

// /**
//  * This function handles any changes to the GoJS model.
//  * It is here that you would make any updates to your React state, which is dicussed below.
//  */
// function handleModelChange(changes) {
//   alert("GoJS model changed!");
// }


