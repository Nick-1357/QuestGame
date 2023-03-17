export const clearBoard = (context: CanvasRenderingContext2D | null) => {
    if (context) {
        context.clearRect(0, 0, 1000, 600);
    }
};


export interface IObjectBody {
    x: number;
    y: number;
}

export interface questPosDict {
    [key: number]: number[];
}

export const drawObject = (
    context: CanvasRenderingContext2D | null,
    objectBody: IObjectBody[],
    fillColor: string,
    strokeStyle = '#146356'
) => {
    if (context) {
        objectBody.forEach((object: IObjectBody) => {
            context.fillStyle = fillColor; 
            context.strokeStyle = strokeStyle;
            context?.fillRect(object.x, object.y, 20, 20);
            context?.strokeRect(object.x, object.y, 20, 20);
        });
    }
};

function randomNum(min: number, max: number) {
    let random = Math.random() * max;
    return random - (random % 20);
}

export const generateRandomPosition = (width: number, height: number) => {
    return {
        x: randomNum(0, width),
        y: randomNum(0, height),
    };
};
