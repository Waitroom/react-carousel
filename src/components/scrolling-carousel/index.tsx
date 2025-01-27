import * as React from 'react';
import {
	FunctionComponent,
	MouseEvent,
	ReactElement,
	useCallback,
	useRef,
	useState,
} from 'react';
import { getOuterWidth } from '../../helpers';
import styles from '../../styles/slider/styles.module.css';
import { Item, SlideDirection } from '../../types/carousel';

export const ScrollingCarousel: FunctionComponent<SliderProps> = ({
	children,
	className = '',
	leftIcon,
	rightIcon,
	showDisabledArrows,
	navStyle,
	sliderStyle,
	...rest
}) => {
	const slider = useRef<HTMLDivElement>(null);
	const [isDown, setIsDown] = useState(false);
	const [position, setPosition] = useState({
		startX: 0,
		scrollLeft: 0,
	});

	const showArrows = (): Arrows => {
		const sliderElement = slider.current;
		const left = !!sliderElement && sliderElement.scrollLeft > 0;
		const right =
			!!sliderElement &&
			sliderElement.scrollWidth >
				sliderElement.scrollLeft + sliderElement.offsetWidth;
		return {
			has: left || right,
			left,
			right,
		};
	};
	const [showArrow, setShowArrow] = useState<Arrows>(showArrows());

	const onScroll = (_: Event) => {
		setShowArrow(showArrows());
	};

	const ref = useCallback(
		(node) => {
			if (node !== null) {
				Object.defineProperty(slider, 'current', { value: node });
				setShowArrow(showArrows());
				node.addEventListener('scroll', onScroll);
			}
		},
		[slider, children],
	);

	const mouseDown = (e: MouseEvent) => {
		setIsDown(true);
		setPosition({
			startX: e.pageX - slider.current!.offsetLeft,
			scrollLeft: slider.current!.scrollLeft,
		});
	};

	const mouseUp = (_: MouseEvent) => {
		setIsDown(false);
		setShowArrow(showArrows());
		slider.current!.classList.remove(styles.sliding);
	};

	const mouseMove = (e: MouseEvent) => {
		if (!isDown) return;
		e.preventDefault();
		slider.current!.classList.add(styles.sliding);
		const eventPosition = e.pageX - slider.current!.offsetLeft;
		const slide = eventPosition - position.startX;

		slider.current!.scrollLeft = position.scrollLeft - slide;
	};

	const calculateSlideAmount = (direction: SlideDirection): number => {
		const _slider = slider.current!;
		const currentView =
			direction === SlideDirection.Left
				? _slider.scrollLeft + _slider.offsetWidth
				: _slider.scrollLeft;

		const childNodes = Array.from(_slider.children) as HTMLElement[];
		let nodeWidthSum = 0;
		for (const node of childNodes) {
			const nodeWidth = getOuterWidth(node);
			nodeWidthSum += nodeWidth;

			if (nodeWidthSum >= currentView) {
				const showingPart =
					direction === SlideDirection.Left
						? nodeWidthSum - currentView
						: nodeWidth;

				return (_slider.offsetWidth - showingPart) * direction;
			}
		}

		return _slider.offsetWidth;
	};

	const slide = (direction: SlideDirection) => {
		const slideAmount = calculateSlideAmount(direction);
		const start = slider.current!.scrollLeft;
		smoothHorizontalScroll(500, slideAmount, start);
	};

	const smoothHorizontalScroll = (time: number, amount: number, start: number) => {
		let curTime = 0;
		for (let scrollCounter = 0; curTime <= time; scrollCounter++) {
			window.setTimeout(
				smoothHorizontalScrollBehavior,
				curTime,
				(scrollCounter * amount) / 100 + start,
			);
			curTime += time / 100;
		}
	};

	const smoothHorizontalScrollBehavior = (amount: number) => {
		slider.current!.scrollLeft = amount;
	};

	const getArrow = (
		direction: SlideDirection,
		data: string,
		enabled: boolean,
		element?: ReactElement,
	) => {
		if (!showDisabledArrows && !enabled) return null;
		return (
			<div
				className={enabled ? 'enabled' : 'disabled'}
				data-arrow={data}
				onClick={() => slide(direction)}
			>
				{element ?? <button />}
			</div>
		);
	};

	return (
		<div
			className={`${styles.sliderBase} ${className}`}
			data-testid="carousel"
			{...rest}
		>
			<div
				ref={ref}
				onMouseDown={mouseDown}
				onMouseLeave={mouseUp}
				onMouseUp={mouseUp}
				onMouseMove={mouseMove}
				className={styles.slider}
				style={sliderStyle}
			>
				{children.map((c, i) => (
					<React.Fragment key={i}>{c}</React.Fragment>
				))}
			</div>
			{showArrow.has ? (
				<div style={navStyle}>
					{getArrow(SlideDirection.Right, 'left', showArrow.left, leftIcon)}
					{getArrow(SlideDirection.Left, 'right', showArrow.right, rightIcon)}
				</div>
			) : null}
		</div>
	);
};

export interface SliderProps {
	children: Item[];
	className?: string;
	leftIcon?: ReactElement;
	rightIcon?: ReactElement;
	style?: React.CSSProperties;
	navStyle?: React.CSSProperties;
	sliderStyle?: React.CSSProperties;
	showDisabledArrows?: boolean;
}

export type Arrows = {
	has: boolean;
	left: boolean;
	right: boolean;
};
