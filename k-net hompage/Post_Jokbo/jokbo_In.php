<!--
	made by Yang Ji Yong
	made at 2017-07-30
	View Notice_List
-->

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="./jokbo_In.css">
	<title>K-net 홈페이지 족보 글</title>
</head>
<body>
	<!-- 전체 div -->
	<div id="main_border_div_id">
		<!-- 실제 화면 div -->
		<div id="wrapper_div_id">
			<div id="top_div_id">
				<div class="top_div_class">
					top
				</div>
			</div>

			<!-- 중앙 div -->
			<div id="center_div_id">
				<!-- 중앙게시글 div -->
				<div class="center_div_class">

					<div id="post_head_div_id">
						<!-- 중앙게시글View 제목 table -->
						<table>
							<!-- table head -->
							<thead><tr></tr></thead>

							<!-- table end -->
							<tfoot><tr></tr></tfoot>

							<tbody>
								<tr>
									<!-- 게시글 제목, 작성자, 작성일시, 조회수 -->
									<td style="width:200px;">
										<span id="post_title_span_id" class="post_span_class">게시글제목</span>
									</td>
									<td style="width:50px; padding-left:10px">
										<span id="post_author_span_id" class="post_span_class">작성자</span>
									</td>
									<td style="width:100px; padding-left:10px">
										<span id="post_date_span_id" class="post_span_class">2017-03-20</span>
									</td>
									<td style="width:20px; padding-left:10px">
										<span id="post_view_span_id" class="post_span_class">0</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- 중앙게시글View table div -->
					<div id="post_view_div_id">
						<form method="post" id="post_list_form_id">
							<table>
								<!-- table head -->
								<thead><tr></tr></thead>

								<!-- table end -->
								<tfoot><tr></tr></tfoot>

								<!-- table body -->
								<!-- 이후 반복문을 통해 tr태그 생성 -->
								<tbody>
									<tr>
										<td>Lp</td>
										<td>
											<div id="post_view_id">
												<p>
												18세기 영국은 오랜 항해를 해 왔다.<br>
												이때 병사들이 괴질로 사망을 많이 하였다. 그런데 레몬을 먹였더니 살아났다고 한다.<br>
												이건 레몬의 비타민 덕분이다.<br>
												우리 몸에 필요한 비타민 이지만 많은 과일을 먹기에는 역부족<br>
												그러나 현대인들은 간편하게 비타민을 섭취한다. <br>
												과연 비타민은 우리의 몸에 어떻게 작용하고 우리는 비타민을 어떻게 먹어야할까?<br>
												 
												늦은 저녁 댄스강의가 한참이다.<br>
												아침부터 저녁까지 강의를 하느라 쉴틈이 없어서 불규칙한 식습관으로 식사를 놓치기 일쑤여서 항상 비타민을 들고다니며 챙겨먹는다고 한다.<br>
												</p>
											</div>
										</td>
										<td>Rp</td>
									</tr>
								</tbody>
							</table>
						</form>
					</div>
				</div>

				<!-- 게시글 페이지 div -->
				<!-- 현재 선택한 a태그에 대해서만 색변환 해보기 -->
				<div class="page_list_div_class left180">
					<!-- toggleclass를 사용해서 페이지수에 따른 div의 왼쪽 margin수정 -->
					<table>
						<thead>
							<tr></tr>
						</thead>

						<tfoot>
							<tr></tr>
						</tfoot>

						<!-- 페이지수에 따라 td 동적 생성 -->
						<tbody>
							<tr>
								<td>
									<a class="a_class" id="page_list_a_prev_id" href="#">이전</a></td>
								<td>
									<a class="a_class" id="page_list_a_1_id" href="#">1</a></td>
								<td>
									<a class="a_class" id="page_list_a_2_id" href="#">2</a></td>
								<td>
									<a class="a_class" id="page_list_a_3_id" href="#">3</a></td>
								<td>
									<a class="a_class" id="page_list_a_4_id" href="#">4</a></td>
								<td>
									<a class="a_class" id="page_list_a_5_id" href="#">5</a></td>
								<td>
									<a class="a_class" id="page_list_a_next_id" href="#">다음</a></td>
							</tr>
						</tbody>

					</table>
				</div>

				<div id="postW_btn_div_id">
					<table>
						<tbody>
							<tr>
								<td>
									<span><a class="a_class" href="#">삭제</a></span>
								</td>
								<td>
									<span><a class="a_class" href="#">수정</a></span>
								</td>
								<td>
									<span><a class="a_class" href="#">목록</a></span>
								</td>
								<td>
									<span><a class="a_class" href="#">글쓰기</a></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>