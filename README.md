# Twitter Network [Work in progress]

Twitter network detailed in the Fouloscopie video (Medhi Moussaid):

https://www.youtube.com/watch?v=UX7YQ6m2r_o

## Roadmap

- Display names on nodes. Pay attention to performance
- Display a sidebar allowing to
    - search for a label and center the camera on the node
    - See how many steps between 2 nodes

## Installation

> prerequisite: Have the NodeJS version installed

1. Clone the project
2. Type the command line: `npm install`
3. Start the local server: `npm run dev`
4. Go to the port given by the previous command

## Technologies

1. SigmaJS: In order to have a fluidity in the interaction with the network, we use WebGL with the SigmaJS library
2. SvelteJS: Useful for inserting web components and interacting with forms and the network

## The data

The data has been converted to JSON format for manipulation with Javascript. The file is `/public/data.json`. In order to make the file as compressed as possible, the keys are minified. So, 

```json
{
    "n": [
        [
            {
                "i":"1",
                "l":"PolgeAime",
                "n":"3530",
                "s":17.588495,
                "c":[238,248,231],
                "p":[6538.7695,1696.4082]
            }
        ...
        ]
    ],
    "e": [
       [
           {
                "i":"10177",
                "s":1953,
                "t":3531,
                "w":1
           }
           ...
        ]
    ]
}
```

- `n`: Node
    - `i`: Id,
    - `l`: Label
    - `n`: Id of the other connected node
    - `s`: Size
    - `c`: Color [r, g, b]
    - `p`: Position [x, y]
- `e`: A line
    - `i`: Id,
    - `s`: Source. Index in the nodes array
    - `t`: Target. Index in the nodes array
    - `w`: Width Line

# License

MIT

