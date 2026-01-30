$$

% Layout: ((2,4),(2,1)):((8,1),(4,1))
\documentclass[convert]{standalone}
\usepackage{tikz}

\begin{document}
\begin{tikzpicture}[x={(0cm,-1cm)},y={(1cm,0cm)},every node/.style={minimum size=1cm, outer sep=0pt}]

\node[fill=black!00] at (0,0) {0};
\node[fill=black!10] at (0,1) {4};
\node[fill=black!00] at (1,0) {8};
\node[fill=black!10] at (1,1) {12};
\node[fill=black!40] at (2,0) {1};
\node[fill=black!50] at (2,1) {5};
\node[fill=black!40] at (3,0) {9};
\node[fill=black!50] at (3,1) {13};
\node[fill=black!20] at (4,0) {2};
\node[fill=black!30] at (4,1) {6};
\node[fill=black!20] at (5,0) {10};
\node[fill=black!30] at (5,1) {14};
\node[fill=black!60] at (6,0) {3};
\node[fill=black!70] at (6,1) {7};
\node[fill=black!60] at (7,0) {11};
\node[fill=black!70] at (7,1) {15};
\draw[color=black,thick,shift={(-0.5,-0.5)}] (0,0) grid (8,2);

\node at (0,-1) {\Large{\texttt{0}}};
\node at (1,-1) {\Large{\texttt{1}}};
\node at (2,-1) {\Large{\texttt{2}}};
\node at (3,-1) {\Large{\texttt{3}}};
\node at (4,-1) {\Large{\texttt{4}}};
\node at (5,-1) {\Large{\texttt{5}}};
\node at (6,-1) {\Large{\texttt{6}}};
\node at (7,-1) {\Large{\texttt{7}}};
\node at (-1,0) {\Large{\texttt{0}}};
\node at (-1,1) {\Large{\texttt{1}}};
\end{tikzpicture}
\end{document}

$$