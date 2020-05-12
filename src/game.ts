import 'phaser';
import { Scene } from 'phaser';

export default class Demo extends Phaser.Scene
{
    snake: Snake;
    lastUpdateMs: number;
    updateIntervalMs: number;

    constructor () {
        super('demo');
        this.updateIntervalMs = 100;
        this.lastUpdateMs = 0;
    }

    preload() {

    }

    create() {
        this.snake = new Snake(this);
        this.add.rectangle(20, 20, 20, 20, 0xa0a0a0).setOrigin(0);
    }

    update(time: number, delta: number) {
        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.right.isDown) {
            this.snake.direction = 'RIGHT';
        }

        if (cursors.left.isDown) {
            this.snake.direction = 'LEFT';
        }

        if (cursors.down.isDown) {
            this.snake.direction = 'DOWN';
        }

        if (cursors.up.isDown) {
            this.snake.direction = 'UP';
        }

        if (this.lastUpdateMs + this.updateIntervalMs < time) {
            this.snake.move();
            this.lastUpdateMs = time;
        }
    }
}

class Snake {

    public direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    public gameObject: Phaser.GameObjects.Rectangle;
    public headPosition: Point;
    public tailPosition: Point;
    public body: Phaser.GameObjects.Group;

    constructor (public scene: Scene) {
        this.headPosition = new Point();
        this.tailPosition = new Point();
        this.gameObject = scene.add.rectangle(this.headPosition.getTopLeftCornerX(), this.headPosition.getTopLeftCornerY(), 20, 20, 0xff0000);
        this.gameObject.setOrigin(0);
        this.direction = 'RIGHT';
        this.body = scene.add.group();
        this.body.add(this.gameObject);
    }

    public move() {
        switch (this.direction) {
            case 'LEFT':
                this.headPosition.x = this.headPosition.x !== 0 ? this.headPosition.x - 1 : 39;
                break;
            case 'RIGHT':
                this.headPosition.x = this.headPosition.x !== 39 ? this.headPosition.x + 1 : 0;
                break;
            case 'UP':
                this.headPosition.y = this.headPosition.y !== 0 ? this.headPosition.y - 1 : 29;
                break;
            case 'DOWN':
                this.headPosition.y = this.headPosition.y !== 29 ? this.headPosition.y + 1 : 0;
                break;
            default:
                break;
        }

        let out = Phaser.Math.Vector2.ZERO;
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.getTopLeftCornerX(), this.headPosition.getTopLeftCornerY(), 1, out);
        this.tailPosition.x = out.x / 20;
        this.tailPosition.y = out.y / 20;

        if (this.headPosition.x === 1 && this.headPosition.y === 1) {
            console.log('grow');
            var newPart = this.scene.add.rectangle(this.tailPosition.getTopLeftCornerX(), this.tailPosition.getTopLeftCornerY(), 20, 20, 0xfff000);
            newPart.setOrigin(0);
            this.body.add(newPart);
        }
    }
}

class Point {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    getTopLeftCornerX() {
        return this.x * 20;
    }

    getTopLeftCornerY() {
        return this.y * 20;
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Demo
};

const game = new Phaser.Game(config);
