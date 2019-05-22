// Copyright 2019 Jon Ogle
// SPDX-License-Identifier: Apache-2.0

math.config({
    number: 'BigNumber', // Default type of number:
                         // 'number' (default), 'BigNumber', or 'Fraction'
    precision: 64        // Number of significant digits for BigNumbers
  });
  

  /////////////////////////////////////////////////////////////main closure
  const main = (function(window){
  /////////////////////////////////////////////////////////////
  
 
  //MAIN///////////////////////////////////////////////////////////////MAIN/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////main
  
  
  const submit = document.getElementById('submit'); 
  const selector = document.querySelector('select');
  const decompInfo = document.querySelector('.decomp-info');
  const matContainer = document.querySelector('.mat-container');
  const instructions = document.querySelector('.instructions');
  const instructionToggle = document.querySelector('.instructions-toggle');
  
  
  changeInfoText(selector.value);
  selector.addEventListener('change', ()=>{changeInfoText(selector.value)});
  instructionToggle.addEventListener('change', ()=>{instructions.classList.toggle('hide-instructions')});
  
  
  submit.onclick = function(){
      
      let route = document.querySelectorAll('select')[0].value;
      let precision = document.querySelectorAll('select')[1].value;
  
      let A = sanitize(document.getElementById('A').value);

    while(matContainer.firstChild) {
        matContainer.removeChild(matContainer.firstChild);   //empty mat-container without innerhtml
    }
      if(!A){return;}
  
      if(!isSquare(A) && route!=3){
          alert('The matrix must be square for this operation.')
          return;
      }
  //main router
      if(route==1){
          luDecompRoute(A, precision);
      }else if(route==2){
          schurDecompRoute(A, precision);
      }else if(route==3){
          qrDecompRoute(A, precision);
      }else if(route==4){
          inverseRoute(A, precision);
      }else if(route==5){
          eigenvalueRoute(A, precision);
      }else if(route==6){
          determinantRoute(A, precision);
      };
  
      matContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
  
      MathJax.Hub.Queue(["Typeset",MathJax.Hub]); //Asynch queue-->need to update typset after input 
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////END MAIN
  
  
  function changeInfoText(textRoute){
   
    while(decompInfo.firstChild) {
        decompInfo.removeChild(decompInfo.firstChild);  //empty info text
    }

    if(textRoute==1){
          decompInfo.insertAdjacentHTML('afterbegin', `<div><h3><a href="https://en.wikipedia.org/wiki/LU_decomposition">[LU Decomposition]</a></h3>
                          <h4>Factors a non-singular matrix "A" into 3 component matrices:</h4>
                          <p>P: a permutation matrix that records row swaps<br>
                          L: a lower triangular matrix<br>
                          U: an upper triangular matrix<br>
                          Where A = PLU</p></div>`);
                          
      }else if(textRoute==2){
          decompInfo.insertAdjacentHTML('afterbegin', `<div><h3><a href="https://en.wikipedia.org/wiki/Schur_decomposition">[Schur Decomposition]</a></h3>
                          <h4>Factors a matrix "A" into a real Schur decomposition with 3 component matrices:</h4>
                          <p>Q: an orthogonal matrix<br>
                          U: a quasi-upper triangular matrix similar to A<br>
                          Q<sup>T</sup>: the transpose and inverse of Q<br>
                          Where A = QUQ<sup>T</sup></p>
                          <p>(note) If U is strictly upper triangular, the diagonal elements are the eigenvalues of A.</p></div>`);
      
      }else if(textRoute==3){
          decompInfo.insertAdjacentHTML('afterbegin', `<div><h3><a href="https://en.wikipedia.org/wiki/QR_decomposition">[QR Decomposition]</a></h3>
                          <h4>Factors a matrix "A"&#8714; &#8477;<sup>nxm</sup> into 2 component matrices:</h4>
                          <p>Q: an orthogonal matrix<br>
                          R: an upper triangular matrix<br>
                          Where A = QR</p></div>`);
  
      }else if(textRoute==4){
          decompInfo.insertAdjacentHTML('afterbegin', `<div><h3><a href="https://en.wikipedia.org/wiki/Invertible_matrix">[Inverse Matrix]</a></h3>
                          <h4>Calculates the inverse of a non-singular matrix "A" such that:</h4>
                          <p>AA<sup>-1</sup> = A<sup>-1</sup>A = I<sub>n<sub/></p></div>`);
  
      }else if(textRoute==5){
          decompInfo.insertAdjacentHTML('afterbegin', `<div><h3><a href="https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors">[Eigenvalues]</a></h3>
                          <h4>Calculates all eigenvalues &#955;<sub>1</sub>...&#955;<sub>n</sub> of "A", such that:</h4>
                          <p>Av = &#955;v</p>
                          <p>Computed by reducing A to Hessenberg form, followed by repeat QR iteration.</p></div>`);
                          
      }else if(textRoute==6){
          decompInfo.insertAdjacentHTML('afterbegin', `<div><h3><a href="https://en.wikipedia.org/wiki/Determinant">[Determinant]</a></h3>
                          <h4>Calculates the determinant of a non-singular matrix "A"</h4></div>`);
      };
  }
  
  ////////////////////////////////////////////////////ROUTES//////////////////////////////////////////////ROUTES
  function luDecompRoute(A, precision){
  
      const matContainer = document.querySelector('.mat-container');
  
      let pString = '\\begin{align} P \\ \\end{align}';
      let lString = '\\begin{align} L \\ \\end{align}';
      let uString = '\\begin{align} U \\ \\end{align}';
  
      const lu = triangularize(A);
  
      let U=clip(lu.U, precision);
      let P=clip(lu.P, precision);
      let L=clip(lu.L, precision);
    
      matContainer.insertAdjacentHTML('afterbegin', `<div><h3>${pString}</h3>
      <div class = 'matrix' id='Pmat'></div></div>
      <div><h3>${lString}</h3>
      <div class = 'matrix' id="Lmat"></div></div>
      <div><h3>${uString}</h3>
      <div class = 'matrix' id="Umat"></div></div> `);
      const tableP = document.getElementById("Pmat");
      const tableL = document.getElementById("Lmat");
      const tableU = document.getElementById("Umat");

      tableP.textContent = toLatex(P);
      tableL.textContent = toLatex(L);
      tableU.textContent = toLatex(U);
  //sanity check
  // console.log(clip(math.multiply(P, L, U)));  //A=PLU
  }
  ////////////////////////////
  function schurDecompRoute(A, precision){
  
      const matContainer = document.querySelector('.mat-container');
      let qString = '\\begin{align} Q \\ \\end{align}';
      let uString = '\\begin{align} U \\ \\end{align}';
      let qtString = '\\begin{align} Q^T \\ \\end{align}';
  
  try {
      var schur = schurDecomp(A);
  } catch (error) {
      alert('Sorry, due to the nature of the householder reflections used, the QR algorithm failed.');
      return;
  }
      matContainer.insertAdjacentHTML('afterbegin', `<div><h3>${qString}</h3>
      <div class = 'matrix' id='Qmat'></div></div>
      <div><h3>${uString}</h3>
      <div class = 'matrix' id="Umat"></div></div>
      <div><h3>${qtString}</h3>
      <div class = 'matrix' id="QTmat"></div></div> `);
  
      const qmat = document.getElementById("Qmat");
      const umat = document.getElementById("Umat");
      const qtmat = document.getElementById("QTmat");
  
          //sanity check
        //   console.log(clip(math.multiply(schur.Q, schur.U, math.transpose(schur.Q))));
      qmat.textContent = toLatex(clip(schur.Q, precision));
      umat.textContent = toLatex(clip(schur.U, precision));
      qtmat.textContent = toLatex(clip(math.transpose(schur.Q), precision));
  
  }
  
///////////////////////////////////  
  function qrDecompRoute(A, precision){ //math.js qr is actually bugged leading zero and sparse matrices will kill. Even tensorflow has a similar problem.
  
      const matContainer = document.querySelector('.mat-container');
      let qString = '\\begin{align} Q \\ \\end{align}';
      let rString = '\\begin{align} R \\ \\end{align}';
  
  try {
      var {Q, R} = math.qr(A);	
  } catch (error) {
      alert('Sorry, due to the nature of the householder reflections used, the QR algorithm failed.');
      return;
  }
      matContainer.insertAdjacentHTML('afterbegin', `<div><h3>${qString}</h3>
      <div class = 'matrix' id='Qmat'></div></div>
      <div><h3>${rString}</h3>
      <div class = 'matrix' id="Rmat"></div></div>`);
      const qmat = document.getElementById("Qmat");
      const rmat = document.getElementById("Rmat");
  
      qmat.textContent = toLatex(clip(Q, precision));
      rmat.textContent = toLatex(clip(R, precision));
  }
  /////////////////////////////////
  function inverseRoute(A, precision){
  
      try {
          const matContainer = document.querySelector('.mat-container');
          let aString = '\\begin{align} A^{-1} \\ \\end{align}';
          let invA = math.inv(A);
  
          matContainer.insertAdjacentHTML('afterbegin', `<div><h3>${aString}</h3>
          <div class = 'matrix' id='Amat'></div></div>`);
  
          const amat = document.getElementById("Amat");
          amat.textContent = toLatex(clip(invA, precision));
      } catch (error) {
          alert('This matrix is singular. Inverses are only defined for non-singular matrices.');
      }
       
  }
  //////////////////////////////////////
  function eigenvalueRoute(A, precision){ 
  
      let eigenvalues;
      let lambdaString = '\\begin{align} ';
      const matContainer = document.querySelector('.mat-container');
      matContainer.insertAdjacentHTML('afterbegin', `<div class = 'matrix' id='eigvals'></div>`);
      
    try {
        if(A.length>2){
          eigenvalues = getEigvals(A);
  
      }else if(A.length===2){
          eigenvalues = eigenvalsFor2x2(A);
      }
    } catch (error) {
        alert('Sorry, due to the nature of the householder reflections used, the QR algorithm failed.');
        return;
    }
      
  
      for (let i = 0; i < eigenvalues.length; i++) {
          if(typeof eigenvalues[i] === 'object'){
              eigenvalues[i].re = eigenvalues[i].re.toFixed(precision || 16); // individually truncate complex eigvals
              eigenvalues[i].im = eigenvalues[i].im.toFixed(precision || 16);
          }
          else{
              eigenvalues[i] = eigenvalues[i].toFixed(precision || 16);
          }
      }
  
      eigenvalues.map((e)=>{
          lambdaString += `  \\lambda_{${eigenvalues.indexOf(e)+1}}=${e} \\\\`;
      });
  
      lambdaString += '\\end{align}';
      document.getElementById("eigvals").textContent=lambdaString;
      
  }
  
  //////////////////////////////////////
  function determinantRoute(A, precision){
  
      const matContainer = document.querySelector('.mat-container');
      matContainer.insertAdjacentHTML('afterbegin', `<div><h3></h3>
      <div class = 'matrix' id='det'></div></div>`);
  
      let detString = `$$\\det${toLatex(A).slice(2, -2)} = `; //removes latex string terminator $$
      
      let lu = triangularize(A);
      
      //determinant A = det(p)det(L)det(U)
  //det(p) = (-1)^(numberOfRowSwaps)
      let determinant = Math.pow(-1, lu.numberOfRowSwaps) * multiplyDiag(lu.L) * multiplyDiag(lu.U);
      if(precision){
          determinant =  determinant.toFixed(precision);
      }
      determinant = parseFloat(determinant);
      detString += `${determinant}$$`;
  
      const det = document.getElementById("det");
      det.textContent = detString;
  
  }
  //////////////////////////////////////////////UTILS/////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
   
  function triangularize (A){
    if(isSquare(A)){ //square check

    if ( math.det(A)!=0  ){ //determinant check
    var P=iMat(A.length);
    
    
    var U=[];
       for (var i=0; i<A.length; i++)  
           U[i]=A[i].slice(0);

    var numberOfRowSwaps = 0;
    var k=0;
    for (k=0; k<U.length; k++){
      for (var j=1; j<U.length-k; j++){//pivot here
        
        var count=1;
        while(Math.abs(U[k][k])<.000000001){//swap rows if pivot is 0
            
        
            if(Math.abs(U[k+count][k])>.000000001) {	//find suitable non-0 pivot and swap row     
                var temp=U[k].slice(0);
                U[k]=U[k+count].slice(0);
                U[k+count]=temp.slice(0);
            
                //much improved from original algorithm...(original had an N^2 inverse operation inside double nested loop)
                var tempP=P[k].slice(0); //same row swaps as U to build permutation matrix P
                P[k]=P[k+count].slice(0);
                P[k+count]=tempP.slice(0);
                numberOfRowSwaps++;
                
            }
            count++;
               
        } //end swapping
        
        
        var rowx = U[k].map(x => x*(U[j+k][k]/U[k][k])); 
           
            for (var i=0; i<U.length; i++){
                U[j+k][i]=U[j+k][i]-rowx[i];
           } 
      }
    
    }
     var L=getL(A, U);
     L = math.multiply(P, L);
     P = math.inv(P); //PA=LU --->A=P^-1 *LU
    
    return {
    
    U: U, 
    P: P,
    L: L,
    numberOfRowSwaps: numberOfRowSwaps
    };
    //LU not unique unless 1s on the diagonal.
//for better stability find pivot with largest absolute value and swap rows, slower
    }}//det check
    alert('Please enter a non-singular matrix. Determinant is 0.');
}
/////////////////////////////////////////////////////////////////////
function getL(A, U){

    return math.multiply(A, math.inv(U)); //A=LU ---> A*U^-1 = L
    
}

//////////////////////////////////////////////0s out fp errors and forces precision to selected # of decimals (rounds not truncates)
function clip (A, precision){

    for (var l=0; l<A.length; l++){
            for(var m = 0; m<A[l].length; m++){
                
                
                if (Math.abs(A[l][m])< 0.0000000000009){
                    A[l][m]=0.0000;
                }
            
                if(precision){
                    A[l][m] = A[l][m].toFixed(precision);
                }

                    A[l][m] = parseFloat(A[l][m]);
            }
            
        }
        return A;
}

//////////////////////////////////////////////generates an NxN identity matrix
function iMat (N){

    var I = [];
    for (var i=0; i<N; i++)
    I.push([]);
    
    for (var j=0; j<N; j++){
        for (var i=0; i<N; i++)
        I[j][i]=0;
        
        I[j][j]=1;
        }
        
    return I;
}
//////////////////////////////////////////////multiplies diagonal entries of matrix
function multiplyDiag(A){
    
    let determinant=1;
    for (let i = 0; i < A.length; i++) {
        determinant*=A[i][i];	
    }
    
    return determinant;
}

/////////////////////////////////////////////////checks if matrix is square
function isSquare(A){

    for (let i = 0; i < A.length; i++) {
        if(A[i].length !== A.length){
            return false;
        }
        
    }
    return true;
}

//////////////////////////////////////////////////sanitize input
function sanitize(A){

try {
    A = A.replace(/\s/g, ''); //trim whitespace

    A = A.split(/(,|\[|])/);  //tokenize expressions

    for(let i=0; i<A.length; i++){
        
        if(A[i]!=='[' && A[i]!==']' && A[i]!==',' && A[i])
            A[i]=String(math.eval(A[i])); //sanitize and eval
        
    }
    
    A=A.join(''); //rejoin array to string for JSON
    
    return JSON.parse(A);


} catch (error) {
    alert('Sorry, invalid input');
    return;
}
    
    
}
//////////////////////////////////////////////////////converts NxM matrix to latex string for rendering
function toLatex(matrix){
    let latexString = '$$\\begin{pmatrix}';

    for (let i=0; i<matrix.length; i++) {
            
            if(i>=1){
                    latexString += '\\\\';
                }
            for (let j=0; j<matrix[i].length; j++) {
                    latexString += matrix[i][j];

                    if(j<matrix[i].length-1){
                    latexString += '&';
                        }
             }
}
    latexString +='\\end{pmatrix}\n$$';
    return latexString;
}



//////////////////////////////////////////////////////////////////////schur decomposition functions
//////////////////////////////////////////////////////////////////////
function triD (A){

    var norm = 0;
    for (var j=1; j<A.length; j++)  
        norm = norm + A[j][0]*A[j][0];
    
    norm = Math.sqrt(norm);
    var alpha = -Math.sign(A[1][0])*norm;
    
    var r = Math.sqrt((1/2)*(alpha*alpha - A[1][0]*alpha));
    var v = [];
    v[0]= 0;
    v[1]=(A[1][0] - alpha)/(2*r);
    
    for (var k=2; k<A.length; k++)
    v[k]=A[k][0]/(2*r);  
    
    var Q = math.subtract(iMat(A.length) , math.multiply(2, outerProduct(v)));	//I-2WW^T
    
    A=math.multiply(Q, A);//similarity transform
    A=math.multiply(A, Q);
    var Ustar = math.multiply(Q, iMat(A.length));  //keep track of househoulder transform sequence. ie. U1*U2*...*Un = U*
    ///////////////////////////////////////
    for (var k = 1; k< A.length-1; k++){
        norm =0;
        for (var j=k+1; j<A.length; j++)  
            norm = norm + A[j][k]*A[j][k];
            
        norm = Math.sqrt(norm);
        var alpha = -Math.sign(A[k+1][k])*norm;
        var r = Math.sqrt((1/2)*(alpha*alpha - A[k+1][k]*alpha));
        var v = [];
        
        for(var i=0; i<=k; i++)
        v[i]= 0;
        
        v[k+1]=(A[k+1][k] - alpha)/(2*r);
        
        for (var j=k+2; j<A.length; j++)
        v[j]=A[j][k]/(2*r);  
        
        //I-2WW^T
        var Q = math.subtract(iMat(A.length) , math.multiply(2, outerProduct(v))   );
        
        A=math.multiply(Q, A);//similarity transform
        A=math.multiply(A, Q); //orthogonality---> Q=Q^t 
        
        Ustar = math.multiply(Ustar, Q);  //build sequence...must preserve for future use in schur and QR
        
    }
    
    return {
        Hess: A,
        Ustar: Ustar
    };
}
/////////////////////////////////////////////
function qrDecomptest (A){

    return math.qr(A);  //general qr from mathjs
}
/////////////////////////////////////////////not for general use: 
//optimized for upper hessenberg or (ideally)tridiagonal matrix, uses Givens rotations, QR iteration runs in O(n^2) compared to O(n^3) 

function qrDecomp (A){				

    var Q = iMat(A.length);
    var R = iMat(A.length);
    var P = [];

       
    for (var i=0; i<A.length; i++)
        P.push([]);
        
        //compute Q
    for (var k=0; k<A.length-1; k++){
    
        P=iMat(A.length);
        //var alpha=Math.atan((-1*A[k+1][k])/A[k][k]);
        
        var r = Math.sqrt(A[k+1][k]*A[k+1][k] + A[k][k]*A[k][k]);
        
        P[k][k] = (A[k][k])/r;     	//Math.cos(alpha);
        P[k][k+1] = (A[k+1][k])/r;    //-Math.sin(alpha);
        P[k+1][k] = -(A[k+1][k])/r;		//Math.sin(alpha);
        P[k+1][k+1] = (A[k][k])/r;			//Math.cos(alpha);
    /////use norms not arctan because of cyclic range 
        R = math.multiply(P, A);
        A = R;
        Q=math.multiply(Q, math.transpose(P));
        
    }
    
    return {
        Q: Q,
        R: R
      };
}
/////////////////////////////////////////////////////////////////////////////////////////schur decomp
function schurDecomp(A){

    let hessTransform = Array.from(A);
    hessTransform = triD(hessTransform);
    
    if(!isNaN(hessTransform.Hess[0][0])){	//check for hessenberg transformation failure in case of a 0 norm
        A = triD(A);
        var eigenPair = repeatQR(A.Hess);	//optimized qr w/ givens rotations

        var U = eigenPair.D;
        var Q = eigenPair.eigenVectors;
        Q = math.multiply(A.Ustar, Q);

      //   console.log('hessenberg alg success');
    }else{
      //   console.log('hessenberg alg failure');
        var eigenPair = repeatQRalt(A);	//skip hess step and use mathjs qr directly(doesn't use pivoting, so still fails often)

        var U = eigenPair.D;
        var Q = eigenPair.eigenVectors;

    }

    return {
        Q: Q,
        U: U
    }
}
///////////////////////////////////////////// D is upper triangular with eigenvals on diagonal, eigenVector matrix contains
//eigenvectors on columns if A is real and symmetric, doesn't work for complex eigenvectors.......at all
function repeatQR(B){

    
    var eigenVectors = iMat(B.length);

        for (var i=0; i<1000; i++){
            
            let qr = qrDecomp(B);
            B  =  math.multiply( qr.R , qr.Q );

            eigenVectors = math.multiply(eigenVectors, qr.Q); //R*Q
        }

        return {
        D: B,
        eigenVectors: eigenVectors
      };

}

function repeatQRalt(B){

    var eigenVectors = iMat(B.length);
    for (var i=0; i<1000; i++){
            
            let qr = math.qr(B);
            B  =  math.multiply( qr.R , qr.Q );

            eigenVectors = math.multiply(eigenVectors, qr.Q); //R*Q
        }

        return {
        D: B,
        eigenVectors: eigenVectors
      };
}

///////////////////////////////////////////////////outer product of W*W
function outerProduct (v){
    
    var Q = [];
    for (var i=0; i<v.length; i++)
        Q.push([]);
    
    
    for (var j = 0; j<v.length; j++){
        for (var i=0; i < v.length; i++)
            Q[j][i]=v[j]*v[i];
    }
    
    return Q;
}
//////////////////////////////////////////////////////////////////Eigenvalues
//degenerate case for 2X2 eigenvalues
function eigenvalsFor2x2 (mat2x2){

var values=[];
var trace = math.trace(mat2x2);

var d = math.det(mat2x2);
var discriminant = trace*trace - 4*d;
var t = math.sqrt(discriminant);  //quadratic formula


if(discriminant<0){
    values.push( `(${trace} + ${t.re} + i*${t.im})/2`);
    values.push( `(${trace} - ${t.re} - i*${t.im})/2`);     //build string for complex eval
} else{
    values.push(`(${trace} + ${t})/2`);  //real eval
    values.push(`(${trace} - ${t})/2`);
}	

return math.eval(values);

}
////////////////////////////////////////////////////////////////
function getEigvals(A){

        let eigenvalues = [];
        let eigenMatrix = clip(schurDecomp(A).U);
        
        for (let i = 0; i < A.length-1; i++) {
            if(eigenMatrix[i+1][i]!=0){
                let conjugatePair = eigenvalsFor2x2([[eigenMatrix[i][i], eigenMatrix[i][i+1]],
                                                    [eigenMatrix[i+1][i], eigenMatrix[i+1][i+1]]]); //get complex eigenvalues from 2x2 sub-matrix
                    eigenvalues.push(...conjugatePair);

                i++; //skip over 2x2 complex block
            }else{
                eigenvalues.push(eigenMatrix[i][i]);	//push diagonal element
            }
            
            
        }
        if (eigenvalues.length < A.length) {
            eigenvalues.push(eigenMatrix[A.length-1][A.length-1]); //push last corner element
        }

            return eigenvalues;
}


///////////////////////////////////////////////////////////////////
  })();